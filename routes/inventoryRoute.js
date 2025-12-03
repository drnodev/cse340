const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const validate = require('../utilities/clasification-validation');
const validateInv = require('../utilities/inventory-validation');
const utilities = require('../utilities/');



router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:cardId", invController.buildByCardId);
router.get("/error/", invController.buildError);
router.get("/", utilities.checkLogin, invController.buildManagement);
router.get("/add-classification", utilities.checkLogin, invController.buildClassificationForm);
router.post("/add-classification", utilities.checkLogin, validate.classificationRules(), validate.checkRegData, invController.addClassification);
router.get("/add-inventory", utilities.checkLogin, invController.buildInventoryForm);
router.post("/add-inventory", utilities.checkLogin, validateInv.inventoryRules(), validateInv.checkInvData, invController.addInventory);

router.get("/getInventory/:classification_id", invController.getInventoryJSON);
router.get("/edit/:inv_id", utilities.checkLogin, invController.editInventoryView);
router.post("/update", utilities.checkLogin, validateInv.inventoryRules(), validateInv.checkInvData, invController.updateInventory);
router.get("/delete/:inv_id", utilities.checkLogin, invController.deleteInventoryView);
router.post("/delete/:inv_id", utilities.checkLogin, invController.deleteInventory);
module.exports = router;

