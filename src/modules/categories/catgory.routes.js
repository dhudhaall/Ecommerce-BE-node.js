import express from 'express';
import * as categoryController from './category.controller.js';
import { upload } from "../../utils/multer-config.js";

const router = express.Router();

router.get('/', categoryController.getCategories);
router.put('/:id', upload.single("image"), categoryController.updateCategory);
router.post('/', upload.single("image"), categoryController.AddCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;