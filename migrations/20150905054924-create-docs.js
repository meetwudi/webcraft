var dbm = global.dbm || require('db-migrate')
var type = dbm.dataType
var databaseConfig = require('../app/config/database')

exports.up = function (db, callback) {
  db.createTable(databaseConfig.DOCS_TABLE, {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: {
      type: type.INTEGER,
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'doc_project_id_fk',
        table: databaseConfig.PROJECTS_TABLE,
        rules: { onDelete: 'CASCADE' },
        mapping: 'id'
      }
    },
    title: 'string',
    content: 'text'
  }, callback)
}

exports.down = function (db, callback) {
  callback()
}
