import prisma from "../../../config/db.js";

/* =========================================================
   CATEGORIES
========================================================= */

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { id: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    productCount: c._count.products,
  }));
};

export const createCategory = async (data) => {
  const { name } = data;
  if (!name || !name.trim()) throw new Error("Category name is required");
  return prisma.category.create({
    data: { name: name.trim() },
  });
};

export const updateCategory = async (id, data) => {
  const { name } = data;
  if (!name || !name.trim()) throw new Error("Category name is required");
  return prisma.category.update({
    where: { id: Number(id) },
    data: { name: name.trim() },
  });
};

export const deleteCategory = async (id) => {
  const categoryId = Number(id);

  // Clean up products in this category along with their sizes, addons, images
  const products = await prisma.product.findMany({
    where: { categoryId },
    select: { id: true },
  });

  for (const p of products) {
    await prisma.size.deleteMany({ where: { productId: p.id } });
    await prisma.addon.deleteMany({ where: { productId: p.id } });
    await prisma.productImage.deleteMany({ where: { productId: p.id } });
    await prisma.cartItem.deleteMany({ where: { productId: p.id } });
  }

  await prisma.product.deleteMany({ where: { categoryId } });

  return prisma.category.delete({
    where: { id: categoryId },
  });
};

/* =========================================================
   PRODUCTS
========================================================= */

export const getProducts = async (filters = {}) => {
  const where = {};
  if (filters.categoryId) {
    where.categoryId = Number(filters.categoryId);
  }

  return prisma.product.findMany({
    where,
    include: {
      category: { select: { id: true, name: true } },
      sizes: { orderBy: { price: "asc" } },
      addons: { orderBy: { price: "asc" } },
      images: true,
    },
    orderBy: { id: "desc" },
  });
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      category: { select: { id: true, name: true } },
      sizes: { orderBy: { price: "asc" } },
      addons: { orderBy: { price: "asc" } },
      images: true,
    },
  });
};

export const createProduct = async (data) => {
  const {
    name,
    description,
    price,
    categoryId,
    isActive = true,
    sizes,
    addons,
    images,
  } = data;

  if (!name || !name.trim()) throw new Error("Product name is required");
  if (!categoryId) throw new Error("Category is required");

  const productData = {
    name: name.trim(),
    description: description ? description.trim() : "",
    price: parseFloat(price) || 0,
    categoryId: Number(categoryId),
    isActive: isActive !== false,
  };

  // Optional Sizes (some products have sizes, some do not)
  if (Array.isArray(sizes) && sizes.length > 0) {
    const validSizes = sizes
      .filter((s) => s && s.name && s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        price: parseFloat(s.price) || 0,
      }));

    if (validSizes.length > 0) {
      productData.sizes = { create: validSizes };
    }
  }

  // Optional Addons (some products have addons, some do not)
  if (Array.isArray(addons) && addons.length > 0) {
    const validAddons = addons
      .filter((a) => a && a.name && a.name.trim())
      .map((a) => ({
        name: a.name.trim(),
        price: parseFloat(a.price) || 0,
      }));

    if (validAddons.length > 0) {
      productData.addons = { create: validAddons };
    }
  }

  // Optional Images
  if (Array.isArray(images) && images.length > 0) {
    const validImages = images
      .filter((img) => img && (img.url || typeof img === "string"))
      .map((img) => ({
        url: typeof img === "string" ? img : img.url,
        alt: img.alt || name.trim(),
      }));

    if (validImages.length > 0) {
      productData.images = { create: validImages };
    }
  }

  return prisma.product.create({
    data: productData,
    include: {
      category: { select: { id: true, name: true } },
      sizes: true,
      addons: true,
      images: true,
    },
  });
};

export const updateProduct = async (id, data) => {
  const productId = Number(id);
  const {
    name,
    description,
    price,
    categoryId,
    isActive,
    sizes,
    addons,
    images,
  } = data;

  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (price !== undefined) updateData.price = parseFloat(price);
  if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  // If sizes array was explicitly provided, synchronize sizes
  if (Array.isArray(sizes)) {
    await prisma.size.deleteMany({ where: { productId } });
    const validSizes = sizes
      .filter((s) => s && s.name && s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        price: parseFloat(s.price) || 0,
        productId,
      }));

    if (validSizes.length > 0) {
      await prisma.size.createMany({ data: validSizes });
    }
  }

  // If addons array was explicitly provided, synchronize addons
  if (Array.isArray(addons)) {
    await prisma.addon.deleteMany({ where: { productId } });
    const validAddons = addons
      .filter((a) => a && a.name && a.name.trim())
      .map((a) => ({
        name: a.name.trim(),
        price: parseFloat(a.price) || 0,
        productId,
      }));

    if (validAddons.length > 0) {
      await prisma.addon.createMany({ data: validAddons });
    }
  }

  // If images array was explicitly provided, synchronize images
  if (Array.isArray(images)) {
    await prisma.productImage.deleteMany({ where: { productId } });
    const validImages = images
      .filter((img) => img && (img.url || typeof img === "string"))
      .map((img) => ({
        url: typeof img === "string" ? img : img.url,
        alt: img.alt || name || "",
        productId,
      }));

    if (validImages.length > 0) {
      await prisma.productImage.createMany({ data: validImages });
    }
  }

  return prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      category: { select: { id: true, name: true } },
      sizes: { orderBy: { price: "asc" } },
      addons: { orderBy: { price: "asc" } },
      images: true,
    },
  });
};

export const deleteProduct = async (id) => {
  const productId = Number(id);

  await prisma.size.deleteMany({ where: { productId } });
  await prisma.addon.deleteMany({ where: { productId } });
  await prisma.productImage.deleteMany({ where: { productId } });
  await prisma.cartItem.deleteMany({ where: { productId } });

  return prisma.product.delete({
    where: { id: productId },
  });
};

/* =========================================================
   ADDONS
========================================================= */

export const getAddons = async (filters = {}) => {
  const where = {};
  if (filters.productId) {
    where.productId = Number(filters.productId);
  }

  return prisma.addon.findMany({
    where,
    include: {
      product: { select: { id: true, name: true } },
    },
    orderBy: { id: "desc" },
  });
};

export const getAddonById = async (id) => {
  return prisma.addon.findUnique({
    where: { id: Number(id) },
    include: {
      product: { select: { id: true, name: true } },
    },
  });
};

export const createAddon = async (data) => {
  const { name, price, productId } = data;
  if (!name || !name.trim()) throw new Error("Addon name is required");
  if (!productId) throw new Error("Product ID is required");

  return prisma.addon.create({
    data: {
      name: name.trim(),
      price: parseFloat(price) || 0,
      productId: Number(productId),
    },
    include: {
      product: { select: { id: true, name: true } },
    },
  });
};

export const updateAddon = async (id, data) => {
  const { name, price, productId } = data;
  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (price !== undefined) updateData.price = parseFloat(price);
  if (productId !== undefined) updateData.productId = Number(productId);

  return prisma.addon.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      product: { select: { id: true, name: true } },
    },
  });
};

export const deleteAddon = async (id) => {
  return prisma.addon.delete({
    where: { id: Number(id) },
  });
};

/* =========================================================
   SIZES
========================================================= */

export const getSizes = async (filters = {}) => {
  const where = {};
  if (filters.productId) {
    where.productId = Number(filters.productId);
  }

  return prisma.size.findMany({
    where,
    include: {
      product: { select: { id: true, name: true } },
    },
    orderBy: { id: "desc" },
  });
};

export const getSizeById = async (id) => {
  return prisma.size.findUnique({
    where: { id: Number(id) },
    include: {
      product: { select: { id: true, name: true } },
    },
  });
};

export const createSize = async (data) => {
  const { name, price, productId } = data;
  if (!name || !name.trim()) throw new Error("Size name is required");
  if (!productId) throw new Error("Product ID is required");

  return prisma.size.create({
    data: {
      name: name.trim(),
      price: parseFloat(price) || 0,
      productId: Number(productId),
    },
    include: {
      product: { select: { id: true, name: true } },
    },
  });
};

export const updateSize = async (id, data) => {
  const { name, price, productId } = data;
  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (price !== undefined) updateData.price = parseFloat(price);
  if (productId !== undefined) updateData.productId = Number(productId);

  return prisma.size.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      product: { select: { id: true, name: true } },
    },
  });
};

export const deleteSize = async (id) => {
  return prisma.size.delete({
    where: { id: Number(id) },
  });
};
