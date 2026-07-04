import * as addAddOnService from './addOns.service.js';


export const getAddOnsList = async (req, res, next)=>{

  try{
    const addons = await addAddOnService.getAddsonList();
    res.json(addons);
  }catch(err){
    next(err);
  }
}

export const getAddonbyId = async (req, res, next) => {
  try {
    const addon = await addAddOnService.getAddOnById(Number(req.params.id));
    res.json(addon);
  } catch (err) {
    next(err);
  }
};

export const addAddon = async (req, res, next) => {
  try {
    const addon = await addAddOnService.addAddOn(req.body);
    res.json(addon);
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
    await addAddOnService.deleteAddon(req.params.id);
    res.json({message:"deleted"});
  } catch (err) {
    next(err);
  }
};