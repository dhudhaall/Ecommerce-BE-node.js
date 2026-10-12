import express from 'express';
import { getDeliveryZones, addDeliveryZone, calculateDeliveryFee } from "../zones/zones.controller.js";

const router = express.Router();

router.get("/", getDeliveryZones);
router.post("/", addDeliveryZone);
router.post("/calculate-fee", calculateDeliveryFee);

export default router;