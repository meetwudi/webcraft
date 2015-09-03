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

// Mock database in testing environment
if (process.env.NODE_ENV === 'test') {
  var mockDB = require('mock-knex')
  mockDB.setAdapter(`knex@${knexInstance.VERSION}`)
  mockDB.mock(knexInstance)
  console.log('Knex is now mocked :)')
}

var bookshelf = require('bookshelf')(knexInstance)

module.exports = {
  bookshelf: bookshelf
}
