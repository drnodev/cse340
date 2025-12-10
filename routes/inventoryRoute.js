const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const validate = require('../utilities/clasification-validation');
const validateInv = require('../utilities/inventory-validation');
const validateReview = require('../utilities/review-validation');
const utilities = require('../utilities/');



router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:cardId", invController.buildByCardId);
router.get("/error/", invController.buildError);
router.get("/", utilities.checkLogin, utilities.checkAdmin, invController.buildManagement);
router.get("/add-classification", utilities.checkLogin, utilities.checkAdmin, invController.buildClassificationForm);
router.post("/add-classification", utilities.checkLogin, utilities.checkAdmin, validate.classificationRules(), validate.checkRegData, invController.addClassification);
router.get("/add-inventory", utilities.checkLogin, utilities.checkAdmin, invController.buildInventoryForm);
router.post("/add-inventory", utilities.checkLogin, utilities.checkAdmin, validateInv.inventoryRules(), validateInv.checkInvData, invController.addInventory);

router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.checkAdmin, invController.getInventoryJSON);
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAdmin, invController.editInventoryView);
router.post("/update", utilities.checkLogin, utilities.checkAdmin, validateInv.inventoryRules(), validateInv.checkInvData, invController.updateInventory);
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAdmin, invController.deleteInventoryView);
router.post("/delete/:inv_id", utilities.checkLogin, utilities.checkAdmin, invController.deleteInventory);


router.post("/detail/:cardId", validateReview.reviewRules(), validateReview.checkRegData, invController.addReview);
module.exports = router;

