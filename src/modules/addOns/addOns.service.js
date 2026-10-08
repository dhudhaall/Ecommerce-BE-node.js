import prisma from "../../config/db.js";

export const getAddsonList = (productId) => {
  const where = productId ? { productId: Number(productId) } : {};
  return prisma.addon.findMany({
    where,
    include: {
      product: { select: { id: true, name: true } },
    },
    orderBy: { id: "desc" },
  });
};

export const getAddOnById = (id) => {
  return prisma.addon.findUnique({
    where: { id: Number(id) },
    include: {
      product: { select: { id: true, name: true } },
    },
  });
};

export const addAddOn = async (data) => {
  const { name, price, productId } = data;
  return prisma.addon.create({
    data: {
      name: name?.trim(),
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
