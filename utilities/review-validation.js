const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const HttpError = require("../utilities/error")

const { getNav, buildByCardId } = require(".")

const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.reviewRules = () => {
  return [
    body("review")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Please provide a review.")
  ]
}

validate.checkRegData = async (req, res, next) => {
  const { review } = req.body
  let errors = []


  const cardId = req.params.cardId
  const data = await invModel.getInventoryById(cardId)
  const reviews = await reviewModel.getReviewsByVehicleId(cardId)

  if (!data) {
    next(new HttpError(404, "Vehicle not found", "No vehicle found with the provided ID."))
  }
  data.reviews = Array.isArray(reviews) ? reviews : []

  errors = validationResult(req)
  if (!errors.isEmpty()) {

    console.log(errors)

    let nav = await getNav()
    const grid = await buildByCardId(data, res.locals?.accountData?.account_type || null)
    res.render("inventory/details", {
      errors: errors.array(),
      title: "Registration",
      nav,
      review: review,
      grid,
      inventory_id: cardId,
    })
    return
  }
  next()
}



module.exports = validate