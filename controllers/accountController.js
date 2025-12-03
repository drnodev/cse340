
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require("dotenv").config()

const account = {}



/* ****************************************
*  Deliver login view
* *************************************** */
account.buildLogin = async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
account.buildRegister = async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
account.registerAccount = async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const password = await bcrypt.hash(account_password, 10)
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


account.loginAccount = async function loginAccount(req, res) {
  let nav = await utilities.getNav()

  const { account_email, account_password } = req.body

  const loginResult = await accountModel.getAccountByEmail(account_email)

  if (!loginResult) {
    req.flash(
      "notice",
      `Sorry, the login failed.`
    )
    return res.status(401).render("account/login", {
      title: "Login",
      nav,
      account_email,
      errors: null,
    })
  }

  try {
    const isMatch = await bcrypt.compare(account_password, loginResult.account_password)

    if (isMatch) {
      delete loginResult.account_password
      const accesToken = jwt.sign(loginResult, process.env.JWT_SECRET, {
        expiresIn: 3600 * 1000,
      })
      res.cookie("jwt", accesToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600 * 1000
      })

      res.redirect("/account")
    } else {
      console.log("Login failed")
      req.flash("notice", "Sorry, the login failed.")
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        account_email,
        errors: null,
      })
    }
  } catch (error) {
    console.log(error)
    req.flash("notice", "Sorry, the login failed.")
    res.status(401).render("account/login", {
      title: "Login",
      nav,
      account_email,
      errors: null,
    })
  }

}

account.buildAccount = async function buildAccount(req, res) {


  console.log(res.locals.accountData, "Account")

  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id,
    account_type: res.locals.accountData.account_type
  })
}


account.logoutAccount = async function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/account/login")
}


account.buildEdit = async function buildEdit(req, res) {
  let nav = await utilities.getNav()
  res.render("account/edit", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id,
    account_type: res.locals.accountData.account_type
  })
}

account.editAccount = async function editAccount(req, res) {
  let nav = await utilities.getNav()


  const { account_firstname, account_lastname, account_email } = req.body
  const editResult = await accountModel.editAccount(
    account_firstname,
    account_lastname,
    account_email,
    res.locals.accountData.account_id
  )

  if (editResult) {

    //update token
    const accesToken = jwt.sign(editResult.rows[0], process.env.JWT_SECRET, {
      expiresIn: 3600 * 1000,
    })
    res.cookie("jwt", accesToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600 * 1000
    })

    req.flash(
      "notice",
      `Congratulations You have successfully updated your account`
    )
    res.redirect("/account/edit")

  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/edit", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      account_id: res.locals.accountData.account_id,
      account_type: res.locals.accountData.account_type
    })
  }
}

account.buildEditPassword = async function buildEditPassword(req, res) {
  let nav = await utilities.getNav()
  res.render("account/edit", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id,
    account_type: res.locals.accountData.account_type
  })
}

account.editPassword = async function editPassword(req, res) {
  let nav = await utilities.getNav()

  const { account_password } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const editResult = await accountModel.editPassword(
    hashedPassword,
    res.locals.accountData.account_id
  )

  req.flash(
    "notice",
    `Congratulations You have successfully updated your password`
  )

  res.render("account/edit", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id,
    account_type: res.locals.accountData.account_type
  })
}


module.exports = account