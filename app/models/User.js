var bookshelf = appRequire('app/init/database').bookshelf
var databaseConfig = appRequire('app/config/database')

var User = bookshelf.Model.extend({
  tableName: databaseConfig.USER_TABLE
})

module.exports = User
