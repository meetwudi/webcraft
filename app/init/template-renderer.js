var exphbs = require('express-handlebars')

var hbs = exphbs.create({
  helpers: {
    assetPath: require('./template-helpers/asset-path')
  },
  extname: '.hbs'
})

module.exports = hbs
