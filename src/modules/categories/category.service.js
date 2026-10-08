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
    orderBy: { id: "asc" },
  });
};

export const addCategory = (data) => {
  return prisma.category.create({ data });
};

export const deleteCategory = (id) => {
  return prisma.category.delete({ where: { id: Number(id) } });
};

export const updateCategory = (id, data) => {
  return prisma.category.update({ where: { id: Number(id) }, data });
};
