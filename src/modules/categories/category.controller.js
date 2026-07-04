import * as categoryService from './category.service.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
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




