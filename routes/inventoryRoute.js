const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:cardId", invController.buildByCardId);
router.get("/error/", invController.buildError);


module.exports = router;

