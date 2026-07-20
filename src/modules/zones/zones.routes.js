import express from 'express';
import { getDeliveryZones, addDeliveryZone } from "../zones/zones.controller.js";

const router = express.Router();

router.get("/", getDeliveryZones);
router.post("/", addDeliveryZone);

export default router;