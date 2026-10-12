import express from 'express';
import * as productsController from './products.controller.js';
import { upload } from "../../utils/multer-config.js";
const router = express.Router();

router.post('/', upload.array("images"), productsController.addProduct);
router.put('/:id', upload.array("images"), productsController.updateProduct);
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.delete('/:id', productsController.deleteProduct);

export default router;