import express from 'express';
import * as categoryController from './category.controller.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.put('/:id', categoryController.updateCategory);
router.post('/', categoryController.AddCategory);
router.delete('/:id', categoryController.deleteCategory);


export default router;