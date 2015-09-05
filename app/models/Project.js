/**
 * Project ORM
 */

var bookshelf = appRequire('app/init/database').bookshelf
var databaseConfig = appRequire('app/config/database')
var randomString = require('randomstring')
var validator = require('validator')
var User = appRequire('app/models/User')

var Project = bookshelf.Model.extend({
  tableName: databaseConfig.PROJECTS_TABLE,
}, {
  /**
   * Factory function to create a Project
   *
   * @public
   * @param  {object} attrs - Project attributes
   * @return {Promise}
   */
  createProject: function (attrs) {

  }
})

module.exports = Project
