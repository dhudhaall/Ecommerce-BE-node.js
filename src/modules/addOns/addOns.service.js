import prisma from '../../config/db.js';

export const getAddsonList = () => {
  return prisma.addon.findMany();
};

export const getAddOnById = (id) => {
  return prisma.addon.findUnique({
    where: { id },
  });
};


export const addAddOn = async (data) => {
  return prisma.addon.create({ data });
}

export const updateAddon = async (id, data) => {
  return prisma.addon.update({where:{id}, data });
}

export const deleteAddon = async (id) => {
  return prisma.addon.delete( {where: { id }});
}
