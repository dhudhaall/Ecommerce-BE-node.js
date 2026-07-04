import prisma from '../../config/db.js';

export const createUser = (data) => {
  return prisma.user.create({ data });
};

export const updateUser = (id, data) => {
   if (!id) throw new Error('User ID is required');
  return prisma.user.update({where: {id}, data});
};

export const getUsers = () => {
  return prisma.user.findMany();
};

export const getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const deleteUser = (id) => {
  return prisma.user.delete({
    where: { id }
  });
};