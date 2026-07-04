import * as userService from './user.service.js';

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(Number(req.params.id), req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.log("err",err);
    next(err);
  }
};