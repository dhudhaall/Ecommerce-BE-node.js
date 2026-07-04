import prisma from '../../config/db.js';


export const checkout = async (req, res) => {
  const { items, customerName, phone, email, street_name_house_number, postalCode, city, floor_unit, notes, payment_method } = req.body;

  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { addons: true }
    });

    if (!product) {
      return res.status(400).json({ error: "Invalid product" });
    }

    // ✅ validate addons
    const validAddonIds = product.addons.map(a => a.id);

    const selectedAddons = item.addons.filter(id =>
      validAddonIds.includes(id)
    );

    // ✅ calculate price
    const addonsPrice = product.addons
      .filter(a => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);

    const itemTotal =
      (product.price + addonsPrice) * item.quantity;

    total += itemTotal;

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      addons: selectedAddons,
      price: itemTotal
    });
  }

  // ✅ create order
const order =  await prisma.order.create({
    data: {
      customerName,
      phone,
      email,
      totalAmount: total,
      street_name_house_number,
      postalCode,
      city,
      floor_unit, 
      notes,
      payment_method,
      items: {
        create: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    }
  });

  const result = {
    order_id: order.id,
    message:"Order Submitted Successfully"
  }

  res.json(result);
};