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

module.exports = router;

