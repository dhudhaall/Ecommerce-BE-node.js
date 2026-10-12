import prisma from "../../../config/db.js";

// Helper for Daily (last 7 days, including today)
const getDailyChart = (orders) => {
  const result = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayLabel = `${dayName}, ${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" })}`;

    const dayOrders = orders.filter((o) => {
      const oDate = new Date(o.createdAt);
      return (
        oDate.getFullYear() === d.getFullYear() &&
        oDate.getMonth() === d.getMonth() &&
        oDate.getDate() === d.getDate()
      );
    });

    const sales =
      Math.round(dayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) * 100) / 100;

    result.push({
      key: dateStr,
      shortLabel: dayName,
      label: dayLabel,
      orders: dayOrders.length,
      sales,
    });
  }
  return result;
};

// Helper for Weekly (last 8 weeks)
const getWeeklyChart = (orders) => {
  const result = [];
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  const currentWeekMonday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - diffToMonday,
    0,
    0,
    0,
    0
  );

  for (let i = 7; i >= 0; i--) {
    const start = new Date(currentWeekMonday);
    start.setDate(start.getDate() - i * 7);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const weekOrders = orders.filter((o) => {
      const oDate = new Date(o.createdAt);
      return oDate >= start && oDate <= end;
    });

    const sales =
      Math.round(weekOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) * 100) / 100;
    const startStr = `${start.getDate()} ${start.toLocaleDateString("en-US", { month: "short" })}`;
    const endStr = `${end.getDate()} ${end.toLocaleDateString("en-US", { month: "short" })}`;

    result.push({
      key: `W-${i}`,
      shortLabel: i === 0 ? "This Week" : startStr,
      label: `${startStr} – ${endStr}`,
      orders: weekOrders.length,
      sales,
    });
  }
  return result;
};

// Helper for Monthly (all 12 months of current year)
const getMonthlyChart = (orders) => {
  const result = [];
  const now = new Date();
  const year = now.getFullYear();

  for (let m = 0; m < 12; m++) {
    const d = new Date(year, m, 1);
    const monthName = d.toLocaleDateString("en-US", { month: "short" });
    const fullMonth = d.toLocaleDateString("en-US", { month: "long" });

    const monthOrders = orders.filter((o) => {
      const oDate = new Date(o.createdAt);
      return oDate.getFullYear() === year && oDate.getMonth() === m;
    });

    const sales =
      Math.round(monthOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) * 100) / 100;

    result.push({
      key: `${year}-${m + 1}`,
      shortLabel: monthName,
      label: `${fullMonth} ${year}`,
      orders: monthOrders.length,
      sales,
    });
  }
  return result;
};

// Helper for Yearly (last 4 years up to current year)
const getYearlyChart = (orders) => {
  const result = [];
  const now = new Date();
  const currentYear = now.getFullYear();

  for (let y = currentYear - 3; y <= currentYear; y++) {
    const yearOrders = orders.filter((o) => {
      const oDate = new Date(o.createdAt);
      return oDate.getFullYear() === y;
    });

    const sales =
      Math.round(yearOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) * 100) / 100;

    result.push({
      key: `${y}`,
      shortLabel: `${y}`,
      label: `Year ${y}`,
      orders: yearOrders.length,
      sales,
    });
  }
  return result;
};

export const getSalesStats = async (req, res) => {
  try {
    const now = new Date();

    // Start of Today (00:00:00.000)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // Start of This Week (Monday 00:00:00.000)
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - diffToMonday,
      0,
      0,
      0,
      0
    );

    // Start of This Month (1st at 00:00:00.000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    // Exclude cancelled orders from revenue stats
    const validOrdersFilter = {
      status: { not: "cancelled" },
    };

    const [todayOrders, weekOrders, monthOrders, allOrders] = await Promise.all([
      prisma.order.findMany({
        where: { ...validOrdersFilter, createdAt: { gte: startOfToday } },
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: { ...validOrdersFilter, createdAt: { gte: startOfWeek } },
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: { ...validOrdersFilter, createdAt: { gte: startOfMonth } },
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: validOrdersFilter,
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
    ]);

    const sumSales = (list) =>
      Math.round(list.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0) * 100) / 100;

    const stats = {
      today: {
        totalSales: sumSales(todayOrders),
        orderCount: todayOrders.length,
      },
      thisWeek: {
        totalSales: sumSales(weekOrders),
        orderCount: weekOrders.length,
      },
      thisMonth: {
        totalSales: sumSales(monthOrders),
        orderCount: monthOrders.length,
      },
      allTime: {
        totalSales: sumSales(allOrders),
        orderCount: allOrders.length,
      },
      charts: {
        daily: getDailyChart(allOrders),
        weekly: getWeeklyChart(allOrders),
        monthly: getMonthlyChart(allOrders),
        yearly: getYearlyChart(allOrders),
      },
    };

    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET SALES STATS ERROR:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch sales statistics" });
  }
};
