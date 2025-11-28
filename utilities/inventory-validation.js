const { getNav, buildClassificationList } = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}


/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty().withMessage("Make is required.")
            .isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),

        body("inv_model")
            .trim()
            .notEmpty().withMessage("Model is required."),

        body("inv_year")
            .isInt({ min: 1900, max: 2026 })
            .withMessage("Year must be a valid number."),

        body("inv_description")
            .trim()
            .notEmpty().withMessage("Description is required."),

        body("inv_image")
            .trim()
            .notEmpty().withMessage("Image path is required."),

        body("inv_thumbnail")
            .trim()
            .notEmpty().withMessage("Thumbnail path is required."),

        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),

        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Miles must be a positive number."),

        body("inv_color")
            .trim()
            .notEmpty().withMessage("Color is required."),

        body("classification_id")
            .isInt().withMessage("Please choose a valid classification.")
    ]
}


/* ******************************
 * Check data and return errors or continue to inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await getNav()
        res.render("./inventory/management/add-inventory", {
            errors: errors.array(),
            title: "Add Inventory",
            nav,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            classificationList: await buildClassificationList()
        })
        return
    }
    next()
}


module.exports = validate