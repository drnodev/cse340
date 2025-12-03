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
    classificationSelect: await utilities.buildClassificationList(),
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
      classificationSelect: await utilities.buildClassificationList(),
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
      nav,
      classificationSelect: await utilities.buildClassificationList(),
    })
  } catch (error) {
    console.error("addInventory error:", error)
    next(error)
  }
}



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.updateInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const invData = req.body
    const updatedItem = await invModel.updateInventory(inv_id, invData)
    const nav = await utilities.getNav()
    if (updatedItem) {
      req.flash("notice", "Inventory updated successfully.")
      res.redirect(`/inv`)
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: invData.inv_id,
        inv_make: invData.inv_make,
        inv_model: invData.inv_model,
        inv_year: invData.inv_year,
        inv_description: invData.inv_description,
        inv_image: invData.inv_image,
        inv_thumbnail: invData.inv_thumbnail,
        inv_price: invData.inv_price,
        inv_miles: invData.inv_miles,
        inv_color: invData.inv_color,
        classification_id: invData.classification_id
      })
    }
  } catch (error) {
    console.error("updateInventory error:", error)
    next(error)
  }
}

invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  if (!itemData) {
    next(new HttpError(404, "Item not found", "No item found with the provided ID."))
    return
  }
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Are you sure you want to delete this item?",
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const deletedItem = await invModel.deleteInventory(inv_id)
  const nav = await utilities.getNav()
  if (deletedItem) {
    req.flash("notice", "Inventory deleted successfully.")
    res.redirect(`/inv`)
  } else {
    const classificationSelect = await utilities.buildClassificationList()
    req.flash("notice", "Sorry, an error occurred.")
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect: await utilities.buildClassificationList(),
    })
  }
}

module.exports = invCont