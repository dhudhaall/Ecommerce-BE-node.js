import prisma from '../../config/db.js';

export const getProducts = () => {
  return prisma.product.findMany({
     include: { addons: true, images: true, sizes: true },
  });
};

export const getProductById = (id) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const getProductsByCategoryId = async (req, res) => {
  const { categoryId } = req.query;

  const products = await prisma.product.findMany({
    where: { categoryId: Number(categoryId) },
    include: { addons: true, sizes: true, images: true},
  });

  res.json(products);
};


export const addProduct = async (data) => {
  console.log("addProduct", data);
  return prisma.product.create({ data:data });
}

export const updateProduct = async (id, data) => {
  return prisma.product.update({where:{id}, data });
}

export const deleteProduct = async (id) => {
  return prisma.product.delete( {where: { id }});

}