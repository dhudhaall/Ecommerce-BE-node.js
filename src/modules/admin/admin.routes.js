import express from "express";
import { getOrders } from "./orders/orders.controller.js";

const router = express.Router();

// 📦 Orders
router.get("/orders", getOrders);

export default router;