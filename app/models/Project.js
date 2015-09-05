/**
 * Project ORM
 */

var bookshelf = appRequire('app/init/database').bookshelf
var databaseConfig = appRequire('app/config/database')
var randomString = require('randomstring')

var Project = bookshelf.Model.extend({
  tableName: databaseConfig.PROJECTS_TABLE,

  remove: function () {

  }
}, {
  createProject: function (attrs) {

  },

  _checkIdExists: function (id) {

  }
})

module.exports = Project
