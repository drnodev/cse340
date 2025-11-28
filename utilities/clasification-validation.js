const { getNav } = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage("Please provide a valid classification name (no spaces).")
    ]
}


/* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await getNav()
        res.render("./inventory/management/add-classification", {
            errors: errors.array(),
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}



module.exports = validate