var sql = require('sql');

sql.setDialect(process.env.DB_DIALECT);

// users table definition
var users = sql.define({
  name: 'users',
  columns: ['id', 'username', 'password']
});

module.exports = {
  users: users
};
