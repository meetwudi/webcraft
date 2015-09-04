var dbm = global.dbm || require('db-migrate')
var type = dbm.dataType
var databaseConfig = require('../app/config/database')

exports.up = function (db, callback) {
  db.changeColumn(databaseConfig.USERS_TABLE, 'username', {
    type: type.STRING,
    unique: true
  }, callback)
}

exports.down = function (db, callback) {
  db.changeColumn(databaseConfig.USERS_TABLE, 'username', {
    type: type.STRING,
    unique: false
  }, callback)
}
