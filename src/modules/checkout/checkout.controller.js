import prisma from '../../config/db.js';
import Stripe from "stripe";
import axios from "axios";

export const getCartSummary = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.json({ items: [], totalAmount: 0 });
    }

    let totalAmount = 0;
    const summaryItems = [];

    for (const item of items) {
      const { productId, quantity = 1, size, addons = [] } = item;

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true, addons: true, sizes: true },
      });
      if (!product) continue;

      let selectedSize = null;
      let basePrice = product.price;
      if (size && size.id) {
        const foundSize = product.sizes.find((s) => s.id === size.id);
        if (foundSize) {
          selectedSize = foundSize;
          basePrice = foundSize.price;
        }
      }

      const selectedAddons = product.addons.filter((a) => addons.includes(a.id));
      const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);

      const itemTotal = (basePrice + addonsPrice) * quantity;
      totalAmount += itemTotal;

      summaryItems.push({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || null,
        },
        quantity,
        size: selectedSize
          ? { id: selectedSize.id, name: selectedSize.name, price: selectedSize.price }
          : null,
        addons: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
        itemTotal,
      });
    }

    return res.json({ items: summaryItems, totalAmount });
  } catch (error) {
    console.error("Cart Summary Error:", error);
    res.status(500).json({ error: "Failed to calculate cart" });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ============================================================
   CHECKOUT — new snapshot structure + payment routing merged in
   ============================================================ */

export const checkout = async (req, res) => {
  try {
    const {
      customer,
      deliveryType,
      shippingAddress,
      paymentMethod,
      items,
      currency = "eur",
    } = req.body;

    // ---- Validation (from old controller) ----
    if (deliveryType === "delivery") {
      if (!shippingAddress?.address) return res.status(400).json({ error: "Address is required" });
      if (!shippingAddress?.city) return res.status(400).json({ error: "City is required" });
      if (!shippingAddress?.postalCode)
        return res.status(400).json({ error: "Postal Code is required" });
    }

    // FE sends "card"; Stripe branch + schema comment use "stripe"
    const method = paymentMethod === "card" ? "stripe" : paymentMethod;

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { addons: true, sizes: true },
      });
      if (!product) throw new Error("Product not found");

      // SIZE replaces base price (matches getCartSummary — NOT additive)
      let basePrice = product.price;
      let sizeName = null;
      let sizePrice = null;
      if (item.sizeId) {
        const size = product.sizes.find((s) => s.id === item.sizeId);
        if (size) {
          basePrice = size.price;
          sizeName = size.name;
          sizePrice = size.price;
        }
      }

      // ADDONS — only ones that belong to this product
      const selectedAddons = product.addons.filter((a) =>
        (item.addonIds || []).includes(a.id)
      );
      const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

      const itemTotal = (basePrice + addonTotal) * item.quantity;
      subtotal += itemTotal;

      // Snapshot data (from new controller)
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        sizeId: item.sizeId ?? null,
        sizeName,
        sizePrice,
        addonIds: item.addonIds || [],
        addonNames: selectedAddons.map((a) => a.name),
        addonTotal,
        itemTotal,
        notes: item.notes ?? null,
      });
    }

    const deliveryFee = 0; // TODO: delivery-zone fee
    const totalAmount = subtotal + deliveryFee;

    // ---- CREATE ORDER ----
    const order = await prisma.order.create({
      data: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        deliveryType,
        address: shippingAddress?.address ?? null,
        city: shippingAddress?.city ?? null,
        postalCode: shippingAddress?.postalCode ?? null,
        notes: req.body.notes ?? null,
        paymentMethod: method,
        subtotal,
        deliveryFee,
        totalAmount,
        currency,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    // ---- 💵 CASH ----
    if (method === "cash") {
      return res.json({ success: true, orderId: order.id, data: order });
    }

    // ---- 💳 STRIPE (this is what fixes your clientSecret error) ----
    if (method === "stripe") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency,
        metadata: { orderId: order.id.toString() },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeIntentId: paymentIntent.id },
      });

      return res.json({
        paymentType: "stripe",
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      });
    }

    // ---- 🟡 PAYPAL ----
    if (method === "paypal") {
      const tokenRes = await axios.post(
        `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
        "grant_type=client_credentials",
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET,
          },
        }
      );
      const accessToken = tokenRes.data.access_token;

      const orderRes = await axios.post(
        `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: order.id.toString(),
              amount: { currency_code: currency.toUpperCase(), value: totalAmount.toFixed(2) },
            },
          ],
          application_context: {
            user_action: "PAY_NOW",
            return_url: `${process.env.FRONTEND_URL}/checkout/success?orderId=${order.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout?cancelled=1`,
          },
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const paypalOrder = orderRes.data;

      await prisma.order.update({
        where: { id: order.id },
        data: { paypalOrderId: paypalOrder.id }, // needs paypalOrderId in schema
      });

      const approvalUrl = paypalOrder.links.find((l) => l.rel === "approve").href;
      return res.json({ paymentType: "paypal", approvalUrl, orderId: order.id });
    }

    return res.status(400).json({ error: "Unhandled payment method" });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

