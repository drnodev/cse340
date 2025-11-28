const invModel = require("../models/inventory-model")
const HttpError = require("../utilities/error")
const utilities = require("../utilities/")


console.log(HttpError)


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const list = await invModel.getInventoryByClassificationId(classification_id)
  const data = await invModel.getClassificationById(classification_id)
  if (!data) {
    next(new HttpError(404, "Classification not found", "No classification found with the provided ID."))
  }
  const grid = await utilities.buildClassificationGrid(list)
  const nav = await utilities.getNav()
  const className = data.classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildByCardId = async function (req, res, next) {
  try {
    const cardId = req.params.cardId
    const data = await invModel.getInventoryById(cardId)
    if (!data) {
      next(new HttpError(404, "Vehicle not found", "No vehicle found with the provided ID."))
    }
    const grid = await utilities.buildByCardId(data)
    let nav = await utilities.getNav()
    res.render("./inventory/details", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      grid
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}


invCont.buildError = async function (req, res, next) {
  next(new HttpError(500, "Error", "Error"))
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: ""
  })
}


invCont.addClassification = async function (req, res, next) {
  try {
    const classification_name = req.body.classification_name
    await invModel.addClassification(classification_name)
    const nav = await utilities.getNav()
    req.flash("notice", "Classification added successfully.")
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}


invCont.buildInventoryForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classificationList: await utilities.buildClassificationList()
  })
}
invCont.addInventory = async function (req, res, next) {
  try {

    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body


    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    const nav = await utilities.getNav()
    if (result?.inv_id) {
      req.flash("notice", "Inventory added successfully.")
      return res.redirect(`/inv/detail/${result.inv_id}`)
    }

    return res.render("./inventory/management", {
      title: "Inventory Management",
      nav
    })
  } catch (error) {
    console.error("addInventory error:", error)
    next(error)
  }
}


module.exports = invCont