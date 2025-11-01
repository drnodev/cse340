const Util = {}


Util.getNav = async function (req, res, next) {
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  list += '<li><a href="/inv/" title="View our inventory of vehicles">Inventory</a></li>'
  list += '<li><a href="/about/" title="Learn more about us">About</a></li>'
  list += '<li><a href="/services/" title="View the services we offer">Services</a></li>'
  list += '<li><a href="/contact/" title="Contact us">Contact</a></li>'
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildByCardId = async function(data){
    const html = `<div class="details-car">
    <div class="image-section">
      <img src="${data.inv_image}" alt="Vehicle Image">
    </div>
    <div class="info-section">
      <h2>${data.inv_make} ${data.inv_model} Details</h2>
      <p class='p-gray'><strong>Price:</strong>$ ${parseFloat(data.inv_price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
      <p class='p-no'><strong>Description:</strong> ${data.inv_description}</p>
      <p class='p-gray'><strong>Color:</strong> ${data.inv_color}</p>
      <p class='p-no'><strong>Make:</strong> ${data.inv_make}</p>
      <p class='p-gray'><strong>Model:</strong> ${data.inv_model}</p>
      <p class='p-no'><strong>Year:</strong> ${data.inv_year}</p>
      <p class='p-gray'><strong>Miles:</strong> ${parseFloat(data.inv_miles).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
    </div>
  </div>`


    return html
}


Util.renderErrorPage = async function (code, req, res, next){
    const message = code == 404 ? "Page not found" : "Server Error Try Again"
    let nav = await Util.getNav()

    res.render("./errors/error", {
        title: code,
        nav,
        grid :"",
        message
    })    
}


module.exports = Util
