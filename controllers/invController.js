const invModel   = require("../models/inventory-model")
const HttpError = require("../utilities/error")
const utilities  = require("../utilities/")


console.log(HttpError)


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildByCardId = async function (req, res, next){
    try {
        const cardId = req.params.cardId
        const data   = await invModel.getInventoryById(cardId)
       

        if (!data) {
         throw new HttpError(404, "Vehicle not found", "No vehicle found with the provided ID.")
        }


        const grid   = await utilities.buildByCardId(data)
        let nav      = await utilities.getNav()




        res.render("./inventory/details",{
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

module.exports =  invCont