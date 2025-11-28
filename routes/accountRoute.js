const regValidate = require('../utilities/account-validation');
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const router = require("express").Router();



router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)
router.post("/register",regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount)





module.exports = router;
