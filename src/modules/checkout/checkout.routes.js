import express from 'express';
import * as checkoutController from './checkout.controller.js';
import * as paypalCapture from './paypal.webhook.js';
import { stripeConfirm } from './stripe.webhook.js';

const router = express.Router();

router.post('/', checkoutController.checkout);
router.post("/summary", checkoutController.getCartSummary);
router.post("/paypal-capture", paypalCapture.paypalCapture);
router.post("/stripe-confirm", stripeConfirm);


export default router;