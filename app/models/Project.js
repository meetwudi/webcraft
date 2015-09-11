/**
 * Project ORM
 */

var bookshelf = appRequire('app/init/database').bookshelf
var databaseConfig = appRequire('app/config/database')
var randomString = require('randomstring')
var dataRules = appRequire('app/config/data-rules')
var Promise = require('bluebird')
var ProjectMockExtension = appRequire('app/models/Project_mock')
var extend = require('extend')
var User
var Doc

var Project = bookshelf.Model.extend({
  tableName: databaseConfig.PROJECTS_TABLE,

  docs: function () {
    return this.hasMany(Doc)
  },

  user: function () {
    return this.belongsTo(User)
  }
}, {
  /**
   * Generate a project name for the user
   * @param  {[type]}
   * @return {[type]}
   */
  _generateName: function (user) {
    return new Promise(function (resolve, reject) {
      function generate () {
        var projectName = randomString.generate(dataRules.DEFAULT_PROJECT_NAME_LENGTH)
        return user.hasProjectName(projectName).then(function (hasProjectName) {
          if (hasProjectName) return generate(user)
          else return projectName
        })
      }
      generate().then(resolve, reject)
    })
  },

  /**
   * Factory function to create a Project
   *
   * @public
   * @param {User} user - User who owns the project
   * @param  {object} attrs - Project attributes
   * @return {Promise}
   */
  createProject: function (user, attrs) {
    return Project._generateName(user)
      .then(function (projectName) {
        attrs = extend(attrs, {
          name: projectName,
          user_id: user.get('id')
        })
        var project = new Project(attrs)
        return project.save()
      })
  }
})

Project = Project.extend(ProjectMockExtension.memberWide, ProjectMockExtension.classWide)

Project = bookshelf.model('Project', Project)
User = bookshelf.model('User') || appRequire('app/models/User')
Doc = bookshelf.model('Doc') || appRequire('app/models/Doc')

module.exports = Project
