import prisma from "../../../config/db.js";

const getDateFilter = (filter, fromDate, toDate) => {
  const now = new Date();

  if (filter === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return { gte: start, lte: now };
  }

  if (filter === "week") {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { gte: start, lte: now };
  }

  if (filter === "month") {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return { gte: start, lte: now };
  }

  if (fromDate && toDate) {
    return {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    };
  }

  return undefined;
};

export const getOrdersService = async (query) => {
  const {
    page = 1,
    limit = 10,
    filter,
    fromDate,
    toDate,
    status,
  } = query;

  const skip = (page - 1) * limit;

  const dateFilter = getDateFilter(filter, fromDate, toDate);

  const where = {
    ...(dateFilter && { createdAt: dateFilter }),
    ...(status && { status }), // ✅ updated field name
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true, // ✅ NO nested include needed
      },
      orderBy: { createdAt: "desc" },
      skip: Number(skip),
      take: Number(limit),
    }),
    prisma.order.count({ where }),
  ]);

  // ✅ Format clean response
  const formattedOrders = orders.map((order) => ({
    id: order.id,
    firstName: order.firstName,
    lastName: order.lastName,
    email: order.email,
    phone: order.phone,

    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,

    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    totalAmount: order.totalAmount,

    createdAt: order.createdAt,

    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,

      size: item.sizeName,
      sizePrice: item.sizePrice,

      addons: item.addonNames || [],

      addonTotal: item.addonTotal,
      itemTotal: item.itemTotal,

      notes: item.notes,
    })),
  }));

  return {
    success: true,
    data: formattedOrders,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};