var exphbs = require('express-handlebars')

var hbs = exphbs.create({
  helpers: {},
  extname: '.hbs'
})

module.exports = hbs
