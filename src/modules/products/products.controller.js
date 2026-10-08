import * as productService from "./products.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts(req.query.categoryId);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // If files uploaded via multer
    if (req.files && req.files.length > 0) {
      body.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
      }));
    }

    const product = await productService.addProduct(body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (req.files && req.files.length > 0) {
      body.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
      }));
    }

    const product = await productService.updateProduct(Number(req.params.id), body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(Number(req.params.id));
    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    next(err);
  }
};
