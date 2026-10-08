import * as addAddOnService from "./addOns.service.js";

export const getAddOnsList = async (req, res, next) => {
  try {
    const addons = await addAddOnService.getAddsonList(req.query.productId);
    res.json(addons);
  } catch (err) {
    next(err);
  }
};

export const getAddonbyId = async (req, res, next) => {
  try {
    const addon = await addAddOnService.getAddOnById(Number(req.params.id));
    if (!addon) {
      return res.status(404).json({ error: "Addon not found" });
    }
    res.json(addon);
  } catch (err) {
    next(err);
  }
};

export const addAddon = async (req, res, next) => {
  try {
    const addon = await addAddOnService.addAddOn(req.body);
    res.status(201).json(addon);
  } catch (err) {
    next(err);
  }
};

export const updateAddon = async (req, res, next) => {
  try {
    const addon = await addAddOnService.updateAddon(Number(req.params.id), req.body);
    res.json(addon);
  } catch (err) {
    next(err);
  }
};

export const deleteAddon = async (req, res, next) => {
  try {
    await addAddOnService.deleteAddon(Number(req.params.id));
    res.json({ message: "Addon deleted successfully." });
  } catch (err) {
    next(err);
  }
};