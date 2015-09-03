/**
 * Database initialization. This file initializes bookshelf ORM with configured knex instance.
 *
 * @module app/init/database
 */

var Knex = require('knex')

var knexInstance = new Knex({
  client: process.env.DB_DIALECT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
  }
})

var bookshelf = require('bookshelf')(knexInstance)

module.exports = {
  bookshelf: bookshelf
}
