var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var tableNames = require('./constants/table-names');

console.log(dbm);

exports.up = function(db, callback) {
  db.createTable(tableNames.USERS_TABLE, {
    id: { type: type.INTEGER, primaryKey: true, },
    username: type.STRING,
    password: type.STRING,
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable(tableNames.USERS_TABLE, callback);
};
