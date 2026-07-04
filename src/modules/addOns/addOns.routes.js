import express from 'express';
import * as addonController from './addOns.controller.js';

const router = express.Router();

router.post('/', addonController.addAddon);
router.put('/:id', addonController.updateAddon);
router.get('/', addonController.getAddOnsList);
router.get('/:id', addonController.getAddonbyId);
router.delete('/:id', addonController.deleteAddon);

export default router;