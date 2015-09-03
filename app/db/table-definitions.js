var sql = require('sql'),
  tableStructures = require('./table-structures');

sql.setDialect(process.env.DB_DIALECT);

// users table definition
var users = sql.define({
  name: tableStructures.USERS_TABLE,
  columns: tableStructures.USERS_TABLE_COLUMNS
});

module.exports = {
  users: users
};
