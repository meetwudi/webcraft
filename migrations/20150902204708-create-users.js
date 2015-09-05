var dbm = global.dbm || require('db-migrate')
var type = dbm.dataType
var databaseConfig = require('../app/config/database')

console.log(dbm)

exports.up = function (db, callback) {
  db.createTable(databaseConfig.USERS_TABLE, {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    username: type.STRING,
    password: type.STRING
  }, callback)
}

exports.down = function (db, callback) {
  db.dropTable(databaseConfig.USERS_TABLE, callback)
}
