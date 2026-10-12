
import { getOrdersService } from "./orders.services.js";
import prisma from "../../../config/db.js";
import { orderEmitter, ORDER_EVENTS, broadcastOrderStatus } from "./orders.events.js";

export const getOrders = async (req, res) => {
  try {
    const result = await getOrdersService(req.query);

    return res.status(200).json(result);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


// Allowed order lifecycle states
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

/* ============================================================
   GET /admin/orders/:id
   Full order for the admin detail / kitchen view.
   ============================================================ */

export const getOrderById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    console.log("order Id", req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid order id." });

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) return res.status(404).json({ error: "Order not found." });

    const data = {
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,

      customer: {
        name: `${order.firstName} ${order.lastName}`,
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
      },

      delivery: {
        type: order.deliveryType,
        address: order.address,
        city: order.city,
        postalCode: order.postalCode,
      },

      notes: order.notes,

      items: order.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        name: i.name,
        quantity: i.quantity,
        size: i.sizeName ? { id: i.sizeId, name: i.sizeName, price: i.sizePrice } : null,
        addons: (Array.isArray(i.addonNames) ? i.addonNames : []).map((name, idx) => ({
          id: Array.isArray(i.addonIds) ? i.addonIds[idx] : null,
          name,
        })),
        addonTotal: i.addonTotal,
        itemTotal: i.itemTotal,
        notes: i.notes,
      })),

      pricing: {
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        totalAmount: order.totalAmount,
        currency: order.currency,
      },

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return res.json({ order: data });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    return res.status(500).json({ error: "Failed to load order." });
  }
};

/* ============================================================
   PATCH /admin/orders/:id/status
   Body: { "status": "preparing" }
   ============================================================ */

export const updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!id) return res.status(400).json({ error: "Invalid order id." });
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed: ${ORDER_STATUSES.join(", ")}`,
      });
    }

    // updateMany doesn't throw when the id doesn't exist — check the count
    const result = await prisma.order.updateMany({
      where: { id },
      data: { status },
    });
    if (result.count === 0) return res.status(404).json({ error: "Order not found." });

    broadcastOrderStatus({ id, status });

    return res.json({ success: true, id, status });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(500).json({ error: "Failed to update status." });
  }
};

/* ============================================================
   GET /admin/orders/stream
   Server-Sent Events (SSE) stream for real-time order alerts.
   Eliminates the need for 30-second client polling.
   ============================================================ */

export const streamOrders = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  // Send initial connection event
  res.write(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);

  const onNewOrder = (order) => {
    res.write(`data: ${JSON.stringify({ type: "new_order", order })}\n\n`);
  };

  const onStatusUpdated = (order) => {
    res.write(`data: ${JSON.stringify({ type: "status_updated", order })}\n\n`);
  };

  orderEmitter.on(ORDER_EVENTS.NEW_ORDER, onNewOrder);
  orderEmitter.on(ORDER_EVENTS.STATUS_UPDATED, onStatusUpdated);

  // Keep-alive heartbeat every 20 seconds
  const heartbeat = setInterval(() => {
    res.write(`: ping\n\n`);
  }, 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    orderEmitter.off(ORDER_EVENTS.NEW_ORDER, onNewOrder);
    orderEmitter.off(ORDER_EVENTS.STATUS_UPDATED, onStatusUpdated);
  });
};