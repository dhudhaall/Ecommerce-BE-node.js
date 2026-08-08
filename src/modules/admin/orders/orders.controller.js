
import { getOrdersService } from "./orders.services.js";

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