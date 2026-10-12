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

  let parsedSizes = sizes;
  if (typeof sizes === "string") {
    try { parsedSizes = JSON.parse(sizes); } catch (e) { parsedSizes = []; }
  }

  let parsedAddons = addons;
  if (typeof addons === "string") {
    try { parsedAddons = JSON.parse(addons); } catch (e) { parsedAddons = []; }
  }

  let parsedImages = images;
  if (typeof images === "string") {
    try { parsedImages = JSON.parse(images); } catch (e) { parsedImages = []; }
  }

  const isProductActive = !(isActive === "false" || isActive === false);

  const productData = {
    name: name?.trim(),
    description: description ? description.trim() : "",
    price: parseFloat(price) || 0,
    categoryId: Number(categoryId),
    isActive: isProductActive,
  };

  if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
    productData.sizes = {
      create: parsedSizes.map((s) => ({
        name: s.name.trim(),
        price: parseFloat(s.price) || 0,
      })),
    };
  }

  if (Array.isArray(parsedAddons) && parsedAddons.length > 0) {
    productData.addons = {
      create: parsedAddons.map((a) => ({
        name: a.name.trim(),
        price: parseFloat(a.price) || 0,
      })),
    };
  }

  if (Array.isArray(parsedImages) && parsedImages.length > 0) {
    productData.images = {
      create: parsedImages.map((img) => ({
        url: typeof img === "string" ? img : img.url,
        alt: (typeof img === "object" && img.alt) ? img.alt : name,
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
    images,
  } = data;

  let parsedSizes = sizes;
  if (typeof sizes === "string") {
    try { parsedSizes = JSON.parse(sizes); } catch (e) { parsedSizes = undefined; }
  }

  let parsedAddons = addons;
  if (typeof addons === "string") {
    try { parsedAddons = JSON.parse(addons); } catch (e) { parsedAddons = undefined; }
  }

  let parsedImages = images;
  if (typeof images === "string") {
    try { parsedImages = JSON.parse(images); } catch (e) { parsedImages = undefined; }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (price !== undefined) updateData.price = parseFloat(price);
  if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
  if (isActive !== undefined) updateData.isActive = !(isActive === "false" || isActive === false);

  if (Array.isArray(parsedSizes)) {
    await prisma.size.deleteMany({ where: { productId } });
    const validSizes = parsedSizes
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

  if (Array.isArray(parsedAddons)) {
    await prisma.addon.deleteMany({ where: { productId } });
    const validAddons = parsedAddons
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

  if (Array.isArray(parsedImages) && parsedImages.length > 0) {
    const newImages = parsedImages.map((img) => ({
      url: typeof img === "string" ? img : img.url,
      alt: (typeof img === "object" && img.alt) ? img.alt : (name || "Product Image"),
      productId,
    }));
    await prisma.productImage.createMany({ data: newImages });
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