const regValidate = require('../utilities/account-validation');
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const router = require("express").Router();



router.get("/", utilities.checkLogin, accountController.buildAccount)
router.get("/login", accountController.buildLogin)
router.post("/login", accountController.loginAccount)
router.get("/register", accountController.buildRegister)
router.post("/register", regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount)
router.get("/logout", accountController.logoutAccount)
router.get("/edit", utilities.checkLogin, accountController.buildEdit)
router.post("/edit", utilities.checkLogin, regValidate.editRules(), regValidate.checkEditData, accountController.editAccount)
router.get("/edit-password", utilities.checkLogin, accountController.buildEditPassword)
router.post("/edit-password", utilities.checkLogin, regValidate.editPasswordRules(), regValidate.checkEditPasswordData, accountController.editPassword)






module.exports = router;
