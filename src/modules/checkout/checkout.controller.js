import prisma from '../../config/db.js';
import Stripe from "stripe";
import axios from "axios";
import { geocodePostalCode, calculateHaversineDistance } from "../zones/zones.controller.js";
import { broadcastNewOrder } from "../admin/orders/orders.events.js";

export const getCartSummary = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.json({ items: [], subtotal: 0, totalAmount: 0 });
    }

    let totalAmount = 0;
    const summaryItems = [];

    for (const item of items) {
      const productId = item.productId || item.product?.id;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const sizeId = item.sizeId || (typeof item.size === "object" ? item.size?.id : item.size);
      const rawAddons = item.addonIds || item.addons || [];
      const addonIds = Array.isArray(rawAddons)
        ? rawAddons.map((a) => (typeof a === "object" && a !== null ? a.id : a)).filter(Boolean)
        : [];

      if (!productId) continue;

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true, addons: true, sizes: true },
      });
      if (!product) continue;

      let selectedSize = null;
      let basePrice = product.price;
      if (sizeId) {
        const foundSize = product.sizes.find((s) => s.id === sizeId);
        if (foundSize) {
          selectedSize = foundSize;
          basePrice = foundSize.price;
        }
      }

      const selectedAddons = product.addons.filter((a) => addonIds.includes(a.id));
      const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);

      const itemTotal = (basePrice + addonsPrice) * quantity;
      totalAmount += itemTotal;

      summaryItems.push({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product?.images?.[0]?.url ? `${process.env.BASE_URL}${product.images[0].url}` : null,
        },
        quantity,
        size: selectedSize
          ? { id: selectedSize.id, name: selectedSize.name, price: selectedSize.price }
          : null,
        addons: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
        itemTotal,
      });
    }

    return res.json({ items: summaryItems, subtotal: totalAmount, totalAmount });
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

    // ---- Validation ----
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

      // SIZE replaces base price
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

      // ADDONS
      const selectedAddons = product.addons.filter((a) =>
        (item.addonIds || []).includes(a.id)
      );
      const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

      const itemTotal = (basePrice + addonTotal) * item.quantity;
      subtotal += itemTotal;

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

    let deliveryFee = 0;
    if (deliveryType === "delivery" && shippingAddress?.postalCode) {
      const cleanPostalCode = String(shippingAddress.postalCode).trim();
      const cleanCity = shippingAddress.city ? String(shippingAddress.city).trim() : '';

      const activeZones = await prisma.deliveryZone.findMany({ where: { active: true } });
      const matchingZone = activeZones.find((z) => {
        const prefixes = Array.isArray(z.coveredPrefixes) ? z.coveredPrefixes : [];
        return (
          z.mainPostalCode === cleanPostalCode ||
          prefixes.some((p) => cleanPostalCode.startsWith(p) || p.startsWith(cleanPostalCode))
        );
      });

      if (matchingZone) {
        deliveryFee = matchingZone.deliveryFee;
      } else {
        const coords = await geocodePostalCode(cleanPostalCode, cleanCity);
        if (coords) {
          const RESTAURANT_LAT = parseFloat(process.env.RESTAURANT_LAT) || 48.5570332;
          const RESTAURANT_LNG = parseFloat(process.env.RESTAURANT_LNG) || 7.9742916;
          const distanceKm = calculateHaversineDistance(RESTAURANT_LAT, RESTAURANT_LNG, coords.lat, coords.lng);
          if (distanceKm <= 2.0) deliveryFee = 2.0;
          else if (distanceKm <= 5.0) deliveryFee = 4.0;
          else if (distanceKm <= 10.0) deliveryFee = 7.0;
        }
      }
    }

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
      broadcastNewOrder(order);
      return res.json({ success: true, orderId: order.id, data: order });
    }

    // ---- 💳 STRIPE ----
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
      try {
        const clientId = (process.env.PAYPAL_CLIENT_ID || "").trim();
        const secret = (process.env.PAYPAL_SECRET || "").trim();
        const baseUrl = (process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com").trim();

        if (!clientId || !secret) {
          return res.status(500).json({ error: "PayPal credentials not configured on server" });
        }

        const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

        const tokenRes = await axios.post(
          `${baseUrl}/v1/oauth2/token`,
          "grant_type=client_credentials",
          {
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const accessToken = tokenRes.data.access_token;

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";

        const orderRes = await axios.post(
          `${baseUrl}/v2/checkout/orders`,
          {
            intent: "CAPTURE",
            purchase_units: [
              {
                reference_id: order.id.toString(),
                amount: {
                  currency_code: currency.toUpperCase(),
                  value: totalAmount.toFixed(2),
                },
              },
            ],
            application_context: {
              user_action: "PAY_NOW",
              return_url: `${frontendUrl}/success?orderId=${order.id}`,
              cancel_url: `${frontendUrl}/checkout?cancelled=1`,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const paypalOrder = orderRes.data;

        await prisma.order.update({
          where: { id: order.id },
          data: { paypalOrderId: paypalOrder.id },
        });

        const approvalLink = paypalOrder.links.find((l) => l.rel === "approve");
        const approvalUrl = approvalLink ? approvalLink.href : null;

        return res.json({
          paymentType: "paypal",
          paypalOrderId: paypalOrder.id,
          approvalUrl,
          orderId: order.id,
        });
      } catch (paypalErr) {
        const errDetail =
          paypalErr.response?.data?.error_description ||
          paypalErr.response?.data?.message ||
          paypalErr.message;
        console.error("PayPal Order Error:", paypalErr.response?.data || paypalErr.message);
        return res.status(500).json({ error: `PayPal order creation failed: ${errDetail}` });
      }
    }

    return res.status(400).json({ error: "Unhandled payment method" });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

