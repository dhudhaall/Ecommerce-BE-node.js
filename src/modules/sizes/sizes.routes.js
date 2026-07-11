import express from "express";
import * as sizeController from "./sizes.controller.js";

const router = express.Router();

router.post("/", sizeController.addSize);
router.get("/", sizeController.getSizes);
router.get("/:id", sizeController.getSizeById);
router.put("/:id", sizeController.updateSize);
router.delete("/:id", sizeController.deleteSize);

export default router;