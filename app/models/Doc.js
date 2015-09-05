/**
 * Document (Doc) ORM
 */

var bookshelf = appRequire('app/init/database').bookshelf
var databaseConfig = appRequire('app/config/database')
var Project

var Doc = bookshelf.Model.extend({
  tableName: databaseConfig.DOCS_TABLE,

  project: function () {
    return this.belongsTo(Project)
  }
})

Doc = bookshelf.model('Doc', Doc)
Project = bookshelf.model('Project') || appRequire('app/models/Project')

module.exports = Doc
