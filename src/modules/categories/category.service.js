import prisma from "../../config/db.js";

export const getCategories = () => {
  return prisma.category.findMany({
    include: {
      products: {
        where: { isActive: true },
        include: {
          addons: true,
          images: true,
          sizes: true,
        },
      },
    },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
};

export const addCategory = (data) => {
  return prisma.category.create({
    data: {
      name: data.name?.trim(),
      image: data.image || null,
    },
  });
};

export const deleteCategory = (id) => {
  return prisma.category.delete({ where: { id: Number(id) } });
};

export const updateCategory = (id, data) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.image !== undefined) updateData.image = data.image;

  return prisma.category.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

