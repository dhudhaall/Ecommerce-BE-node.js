import prisma from "../../config/db.js";

export const getProducts = (categoryId) => {
  const where = categoryId ? { categoryId: Number(categoryId) } : {};
  return prisma.product.findMany({
    where,
    include: {
      category: { select: { id: true, name: true } },
      addons: true,
      images: true,
      sizes: true,
    },
    orderBy: { id: "desc" },
  });
};

export const getProductById = (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      category: { select: { id: true, name: true } },
      addons: true,
      images: true,
      sizes: true,
    },
  });
};

export const addProduct = async (data) => {
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

  const productData = {
    name: name?.trim(),
    description: description ? description.trim() : "",
    price: parseFloat(price) || 0,
    categoryId: Number(categoryId),
    isActive: isActive !== false,
  };

  if (Array.isArray(sizes) && sizes.length > 0) {
    productData.sizes = {
      create: sizes.map((s) => ({
        name: s.name.trim(),
        price: parseFloat(s.price) || 0,
      })),
    };
  }

  if (Array.isArray(addons) && addons.length > 0) {
    productData.addons = {
      create: addons.map((a) => ({
        name: a.name.trim(),
        price: parseFloat(a.price) || 0,
      })),
    };
  }

  if (Array.isArray(images) && images.length > 0) {
    productData.images = {
      create: images.map((img) => ({
        url: typeof img === "string" ? img : img.url,
        alt: img.alt || name,
      })),
    };
  }

  return prisma.product.create({
    data: productData,
    include: {
      category: true,
      addons: true,
      images: true,
      sizes: true,
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
  } = data;

  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (price !== undefined) updateData.price = parseFloat(price);
  if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  if (Array.isArray(sizes)) {
    await prisma.size.deleteMany({ where: { productId } });
    const validSizes = sizes
      .filter((s) => s && s.name)
      .map((s) => ({
        name: s.name.trim(),
        price: parseFloat(s.price) || 0,
        productId,
      }));
    if (validSizes.length > 0) {
      await prisma.size.createMany({ data: validSizes });
    }
  }

  if (Array.isArray(addons)) {
    await prisma.addon.deleteMany({ where: { productId } });
    const validAddons = addons
      .filter((a) => a && a.name)
      .map((a) => ({
        name: a.name.trim(),
        price: parseFloat(a.price) || 0,
        productId,
      }));
    if (validAddons.length > 0) {
      await prisma.addon.createMany({ data: validAddons });
    }
  }

  return prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      category: true,
      addons: true,
      images: true,
      sizes: true,
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