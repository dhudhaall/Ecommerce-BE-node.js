import prisma from '../../config/db.js';
import Stripe from "stripe";
import axios from "axios";

export const getCartSummary = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.json({
        items: [],
        totalAmount: 0
      });
    }

    let totalAmount = 0;
    const summaryItems = [];

    for (const item of items) {
      const {
        productId,
        quantity = 1,
        size,
        addons = []
      } = item;

      // ✅ Fetch full product
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: true,
          addons: true,
          sizes: true
        }
      });

      if (!product) continue; // skip invalid product

      // ✅ -------- SIZE --------
      let selectedSize = null;
      let basePrice = product.price;

      if (size && size.id) {
        const foundSize = product.sizes.find(s => s.id === size.id);

        if (foundSize) {
          selectedSize = foundSize;
          basePrice = foundSize.price;
        }
      }

      // ✅ -------- ADDONS --------
      const validAddonIds = product.addons.map(a => a.id);

      const selectedAddons = product.addons.filter(a =>
        addons.includes(a.id)
      );

      const addonsPrice = selectedAddons.reduce(
        (sum, a) => sum + a.price,
        0
      );

      // ✅ -------- FINAL PRICE --------
      const itemTotal = (basePrice + addonsPrice) * quantity;

      totalAmount += itemTotal;

      // ✅ -------- RESPONSE OBJECT --------
      summaryItems.push({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || null
        },
        quantity,

        size: selectedSize
          ? {
              id: selectedSize.id,
              name: selectedSize.name,
              price: selectedSize.price
            }
          : null,

        addons: selectedAddons.map(a => ({
          id: a.id,
          name: a.name,
          price: a.price
        })),

        itemTotal
      });
    }

    return res.json({
      items: summaryItems,
      totalAmount
    });

  } catch (error) {
    console.error("Cart Summary Error:", error);

    res.status(500).json({
      error: "Failed to calculate cart"
    });
  }
};



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkout = async (req, res) => {
  try {
    const {
      customer,
      deliveryType,
      shippingAddress,
      paymentMethod,
      items,
      currency = "usd"
    } = req.body;


    // ✅ VALIDATION
    if (deliveryType === "delivery") {
      if (!shippingAddress?.address) {
        return res.status(400).json({ error: "Address is required" });
      }
      if(!shippingAddress?.city){
        return res.status(400).json({ error: "city is required" });
      }

      if(!shippingAddress?.postalCode){
          return res.status(400).json({ error: "Postal Code is required" });
      }
    }

    let totalAmount = 0;
    const orderItems = [];

    // ✅ CALCULATE PRICE (SECURE)
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { addons: true, sizes: true }
      });



      if (!product) continue;

      let price = product.price;

      if (item.sizeId) {
        const size = product.sizes.find(s => s.id === item.sizeId);
        if (size) price = size.price;
      }

      const selectedAddons = product.addons.filter(a =>
        item.addonIds.includes(a.id)
      );

      const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);

      const itemTotal = (price + addonsPrice) * item.quantity;

      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        sizeId: item.sizeId,
        addonIds: item.addonIds,
        price: itemTotal
      });
    }

    // ✅ CREATE ORDER (PENDING)
    const order = await prisma.order.create({
      data: {
        customerName: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        deliveryType,
        address: shippingAddress?.address,
        city: shippingAddress?.city,
        postalCode: shippingAddress?.postalCode,
        paymentMethod,
        totalAmount,
        currency,
        items: {
          create: orderItems
        }
      }
    });

   

    // 💵 CASH
    if (paymentMethod === "cash") {
      return res.json({
        success: true,
        orderId: order.id
      });
    }

    // 💳 STRIPE
    if (paymentMethod === "card") {
     
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency,
        metadata: { orderId: order.id.toString() }
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeIntentId: paymentIntent.id }
      });

      return res.json({
        paymentType: "stripe",
        clientSecret: paymentIntent.client_secret
      });
    }

    // 🟡 PAYPAL
    if (paymentMethod === "paypal") {
      const tokenRes = await axios.post(
        `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
        "grant_type=client_credentials",
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
          }
        }
      );

      const accessToken = tokenRes.data.access_token;

      const orderRes = await axios.post(
        `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: currency.toUpperCase(),
                value: totalAmount.toFixed(2)
              }
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const paypalOrder = orderRes.data;

      await prisma.order.update({
        where: { id: order.id },
        data: { paypalOrderId: paypalOrder.id }
      });

      const approvalUrl = paypalOrder.links.find(
        l => l.rel === "approve"
      ).href;

      return res.json({
        paymentType: "paypal",
        approvalUrl
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
};

