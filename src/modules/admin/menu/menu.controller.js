import * as menuService from "./menu.service.js";

/* =========================================================
   CATEGORIES
========================================================= */

export const getCategories = async (req, res, next) => {
  try {
    const categories = await menuService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await menuService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await menuService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await menuService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted successfully." });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   PRODUCTS
========================================================= */

export const getProducts = async (req, res, next) => {
  try {
    const products = await menuService.getProducts(req.query);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await menuService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await menuService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await menuService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await menuService.deleteProduct(req.params.id);
    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   ADDONS
========================================================= */

export const getAddons = async (req, res, next) => {
  try {
    const addons = await menuService.getAddons(req.query);
    res.json(addons);
  } catch (err) {
    next(err);
  }
};

export const getAddonById = async (req, res, next) => {
  try {
    const addon = await menuService.getAddonById(req.params.id);
    if (!addon) {
      return res.status(404).json({ error: "Addon not found." });
    }
    res.json(addon);
  } catch (err) {
    next(err);
  }
};

export const createAddon = async (req, res, next) => {
  try {
    const addon = await menuService.createAddon(req.body);
    res.status(201).json(addon);
  } catch (err) {
    next(err);
  }
};

export const updateAddon = async (req, res, next) => {
  try {
    const addon = await menuService.updateAddon(req.params.id, req.body);
    res.json(addon);
  } catch (err) {
    next(err);
  }
};

export const deleteAddon = async (req, res, next) => {
  try {
    await menuService.deleteAddon(req.params.id);
    res.json({ message: "Addon deleted successfully." });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   SIZES
========================================================= */

export const getSizes = async (req, res, next) => {
  try {
    const sizes = await menuService.getSizes(req.query);
    res.json(sizes);
  } catch (err) {
    next(err);
  }
};

export const getSizeById = async (req, res, next) => {
  try {
    const size = await menuService.getSizeById(req.params.id);
    if (!size) {
      return res.status(404).json({ error: "Size not found." });
    }
    res.json(size);
  } catch (err) {
    next(err);
  }
};

export const createSize = async (req, res, next) => {
  try {
    const size = await menuService.createSize(req.body);
    res.status(201).json(size);
  } catch (err) {
    next(err);
  }
};

export const updateSize = async (req, res, next) => {
  try {
    const size = await menuService.updateSize(req.params.id, req.body);
    res.json(size);
  } catch (err) {
    next(err);
  }
};

export const deleteSize = async (req, res, next) => {
  try {
    await menuService.deleteSize(req.params.id);
    res.json({ message: "Size deleted successfully." });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   UPLOAD IMAGE
========================================================= */

export const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (err) {
    next(err);
  }
};
