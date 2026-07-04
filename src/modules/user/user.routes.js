import express from 'express';
import * as userController from './user.controller.js';

const router = express.Router();

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);

export default router;