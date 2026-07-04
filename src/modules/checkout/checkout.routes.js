import express from 'express';
import * as checkoutController from './checkout.controller.js';

const router = express.Router();

router.post('/', checkoutController.checkout);


export default router;