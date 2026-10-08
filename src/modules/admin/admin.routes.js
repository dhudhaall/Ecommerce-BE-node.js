import express from "express";
import { getOrders, getOrderById, updateOrderStatus } from "./orders/orders.controller.js";
import { login, getMe, createAdmin } from "../auth/auth.controller.js";
import { requireAdmin } from "../../middlewares/auth.middleware.js";
import * as menuController from "./menu/menu.controller.js";
import { upload } from "../../utils/multer-config.js";

const router = express.Router();

/* ---------------- Auth & Orders ---------------- */
router.post("/login", login);
router.get("/me", requireAdmin, getMe);
router.get("/orders", requireAdmin, getOrders);
router.get("/orders/:id", requireAdmin, getOrderById);
router.patch("/orders/:id/status", requireAdmin, updateOrderStatus);

/* ---------------- Menu: Categories ---------------- */
router.get("/categories", requireAdmin, menuController.getCategories);
router.post("/categories", requireAdmin, menuController.createCategory);
router.put("/categories/:id", requireAdmin, menuController.updateCategory);
router.delete("/categories/:id", requireAdmin, menuController.deleteCategory);

/* ---------------- Menu: Products ---------------- */
router.get("/products", requireAdmin, menuController.getProducts);
router.get("/products/:id", requireAdmin, menuController.getProductById);
router.post("/products", requireAdmin, menuController.createProduct);
router.put("/products/:id", requireAdmin, menuController.updateProduct);
router.delete("/products/:id", requireAdmin, menuController.deleteProduct);

/* ---------------- Menu: Addons ---------------- */
router.get("/addons", requireAdmin, menuController.getAddons);
router.get("/addons/:id", requireAdmin, menuController.getAddonById);
router.post("/addons", requireAdmin, menuController.createAddon);
router.put("/addons/:id", requireAdmin, menuController.updateAddon);
router.delete("/addons/:id", requireAdmin, menuController.deleteAddon);

/* ---------------- Menu: Sizes ---------------- */
router.get("/sizes", requireAdmin, menuController.getSizes);
router.get("/sizes/:id", requireAdmin, menuController.getSizeById);
router.post("/sizes", requireAdmin, menuController.createSize);
router.put("/sizes/:id", requireAdmin, menuController.updateSize);
router.delete("/sizes/:id", requireAdmin, menuController.deleteSize);

/* ---------------- Media Upload ---------------- */
router.post("/upload", requireAdmin, upload.single("image"), menuController.uploadImage);

export default router;