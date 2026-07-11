import * as categoryService from './category.service.js';
import { attachProductImagesBaseUrl } from '../../utils/helpers.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const result = attachProductImagesBaseUrl(categories, baseUrl);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const AddCategory = async (req, res, next) => {
  try {
    const category = await categoryService.addCategory(req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(Number(req.params.id), req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
};


export const deleteCategory = async (req, res, next) => {
  try {
     await categoryService.deleteCategory(req.params.id);
     res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};




