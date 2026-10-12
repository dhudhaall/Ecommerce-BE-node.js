import Stripe from "stripe";
import prisma from '../../config/db.js';
import { broadcastNewOrder } from "../admin/orders/orders.events.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(500).send({err});
  }

  if (event.type === "payment_intent.succeeded") {
    const orderId = event.data.object.metadata?.orderId;
    if (orderId) {
      const updatedOrder = await prisma.order.update({
        where: { id: Number(orderId) },
        data: { paymentStatus: "paid", status: "confirmed" },
        include: { items: true },
      });
      broadcastNewOrder(updatedOrder);
    }
  }

  res.json({ received: true });
};

export const stripeConfirm = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body || {};
    if (!orderId) return res.status(400).json({ error: "Order ID required" });

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: true },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.paymentStatus === "paid") {
      return res.json({ success: true, order });
    }

    const intentId = paymentIntentId || order.stripeIntentId;
    if (intentId) {
      const intent = await stripe.paymentIntents.retrieve(intentId);
      if (["succeeded", "processing"].includes(intent.status)) {
        const updated = await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "paid", status: "confirmed" },
          include: { items: true },
        });
        broadcastNewOrder(updated);
        return res.json({ success: true, order: updated });
      }
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error("Stripe confirm error:", err);
    return res.status(500).json({ error: "Failed to confirm Stripe payment" });
  }
};