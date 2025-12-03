const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const validate = require('../utilities/clasification-validation');
const validateInv = require('../utilities/inventory-validation');


router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:cardId", invController.buildByCardId);
router.get("/error/", invController.buildError);
router.get("/", invController.buildManagement);
router.get("/add-classification", invController.buildClassificationForm);
router.post("/add-classification", validate.classificationRules(), validate.checkRegData, invController.addClassification);
router.get("/add-inventory", invController.buildInventoryForm);
router.post("/add-inventory", validateInv.inventoryRules(), validateInv.checkInvData, invController.addInventory);

router.get("/getInventory/:classification_id", invController.getInventoryJSON);
router.get("/edit/:inv_id", invController.editInventoryView);
router.post("/update", validateInv.inventoryRules(), validateInv.checkInvData, invController.updateInventory);
router.get("/delete/:inv_id", invController.deleteInventoryView);
router.post("/delete/:inv_id", invController.deleteInventory);
module.exports = router;

