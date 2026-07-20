import Stripe from "stripe";
import prisma from '../../config/db.js';
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
    await prisma.order.update({ where: { id: Number(orderId) }, data: { paymentStatus: "paid" } });
  }
}

  res.json({ received: true });
};