import prisma from "../../config/db.js";
import axios from "axios";
import { broadcastNewOrder } from "../admin/orders/orders.events.js";

const getPaypalAccessToken = async () => {
  const clientId = (process.env.PAYPAL_CLIENT_ID || "").trim();
  const secret = (process.env.PAYPAL_SECRET || "").trim();
  const baseUrl = (process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com").trim();

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const response = await axios.post(
    `${baseUrl}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

export const paypalCapture = async (req, res) => {
  try {
    const { orderId, paypalOrderId } = req.body || {};

    let targetPaypalId = paypalOrderId;

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
      });

      // If this order is not PayPal (e.g. Stripe card or cash), safely skip
      if (order && order.paymentMethod !== "paypal") {
        return res.json({ success: true, message: "Non-PayPal order; capture skipped." });
      }

      if (order?.paymentStatus === "paid") {
        return res.json({ success: true, message: "Order is already paid." });
      }

      if (!targetPaypalId && order?.paypalOrderId) {
        targetPaypalId = order.paypalOrderId;
      }
    }

    if (!targetPaypalId) {
      return res.status(400).json({ error: "Missing PayPal Order ID" });
    }

    const accessToken = await getPaypalAccessToken();

    const captureRes = await axios.post(
      `${process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com"}/v2/checkout/orders/${targetPaypalId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = captureRes.data;

    if (captureData.status === "COMPLETED") {
      await prisma.order.updateMany({
        where: {
          OR: [
            { paypalOrderId: targetPaypalId },
            { id: isNaN(Number(orderId)) ? -1 : Number(orderId) },
          ],
        },
        data: {
          paymentStatus: "paid",
          status: "confirmed",
        },
      });

      const updatedOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { paypalOrderId: targetPaypalId },
            { id: isNaN(Number(orderId)) ? -1 : Number(orderId) },
          ],
        },
        include: { items: true },
      });

      if (updatedOrder) {
        broadcastNewOrder(updatedOrder);
      }

      return res.json({ success: true, status: "COMPLETED", data: captureData });
    }

    return res.status(400).json({ success: false, status: captureData.status });
  } catch (err) {
    console.error("PayPal capture error:", err.response?.data || err.message);
    return res.status(500).json({ error: "PayPal capture failed" });
  }
};