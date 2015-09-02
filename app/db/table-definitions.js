var sql = require('sql'),
  tableDefinitions = require('table-definitions');

sql.setDialect(process.env.DB_DIALECT);

// users table definition
var users = sql.define({
  name: tableDefinitions.USERS_TABLE,
  columns: ['id', 'username', 'password']
});

module.exports = {
  users: users
};
