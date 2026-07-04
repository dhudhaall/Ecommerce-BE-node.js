import prisma from '../../config/db.js';

export const getCategories = () => {
  return prisma.category.findMany({
     include: { products: {
        include: {
          addons: true,      
          images: true     
        } }}
  });
};

export const addCategory = (data) => {
  return prisma.category.create({data:data});
};

export const deleteCategory = (id) => {
  return prisma.category.delete({where: id});
};

export const updateCategory = (id, data) => {
  return prisma.category.update({where: {id}, data});
};
