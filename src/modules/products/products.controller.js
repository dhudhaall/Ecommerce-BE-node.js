import * as productService from './products.service.js';
import prisma from '../../config/db.js';

export const getProducts = async (req, res, next)=>{

  try{
    const products = await productService.getProducts();
    res.json(products);
  }catch(err){
    next(err);
  }
}


export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    res.json(product);
  } catch (err) {
    next(err);
  }
};


// export const addProduct = async (req, res, next) => {
//   try {
//     const product = await productService.addProduct(req.body);
//     res.json(product);
//   } catch (err) {
//     next(err);
//   }
// };

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};


export const deleteProduct = async (req, res, next) => {
  try {
    const products = await productService.deleteProduct(req.params.id);
    res.json(products);
  } catch (err) {
    next(err);
  }
};


export const addProduct = async (req, res) => {
  try {

    const { name, description, price, categoryId, addonIds } = req.body;

    // ✅ FIX 1: Safe addonIds parsing
    let parsedAddonIds = [];

    if (addonIds) {
      if (Array.isArray(addonIds)) {
        parsedAddonIds = addonIds.map(id => Number(id));
      } else if (typeof addonIds === "string") {
        parsedAddonIds = addonIds.split(",").map(id => Number(id));
      }
    }

    // ✅ FIX 2: Always array for images
    const imagePaths = req.files?.length
      ? req.files.map(file => ({
          url: `/uploads/${file.filename}`
        }))
      : [];

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),

        // ✅ only add if exists
        images: imagePaths.length
          ? { create: imagePaths }
          : undefined,

        addons: parsedAddonIds.length
          ? {
              connect: parsedAddonIds.map(id => ({ id }))
            }
          : undefined
      },
      include: {
        images: true,
        addons: true
      }
    });

    res.json(product);

  } catch (err) {
    console.error("FULL ERROR:", err); // ✅ IMPORTANT

    res.status(500).json({
      error: err.message,   // 👈 show real error
      stack: err.stack      // optional (dev only)
    });
  }
};



