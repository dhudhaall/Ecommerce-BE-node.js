import express from "express";
import { getOrders, getOrderById, updateOrderStatus} from "./orders/orders.controller.js";
import { login, getMe } from "../auth/auth.controller.js";
import { requireAdmin } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", requireAdmin, getMe);

// The order APIs from before — now protected
router.get("/orders", requireAdmin, getOrders);
router.get("/orders/:id", requireAdmin, getOrderById);
router.patch("/orders/:id/status", requireAdmin, updateOrderStatus);

export default router;