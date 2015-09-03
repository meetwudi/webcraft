var tableDefinitions = require('./table-definitions')
var extend = require('extend')

var db = {
  config: require('../config/db'),
  pg: require('pg'),
  tableNames: require('./table-names')
}

// Merge all table definitions into db object
extend(db, tableDefinitions)

module.exports = db
