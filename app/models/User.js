/**
 * User ORM
 *
 * @module app/models/User
 */

var bookshelf = appRequire('app/init/database').bookshelf
var databaseConfig = appRequire('app/config/database')
var bcrypt = require('bcrypt-nodejs')
var Promise = require('bluebird')

/**
 * User ORM class
 *
 * @class
 */
var User = bookshelf.Model.extend({ // prototype properties
  tableName: databaseConfig.USERS_TABLE,

  /**
   *  Validate password for current user
   *
   * @param  {string} password - raw password (not encrypted)
   * @return {Promise}
   */
  validatePassword: function (password) {
    var that = this
    return new Promise(function (resolve, reject) {
      var encryptedPassword = that.get('password')
      User._comparePassword(password, encryptedPassword, function (err, passwordValid) {
        if (err) return reject(err)
        if (!passwordValid) resolve(false)
        resolve(true, that)
      })
    })
  }
}, { // Class properties
  /**
   * Find a user by its username
   *
   * @public
   * @param  {string} username - username
   * @return {Promise}
   */
  getUserByUsername: function (username) {
    return User.where({ username: username })
      .fetch()
  },

  /**
   * Callback called when passwords are compared
   *
   * @private
   * @callback comparePasswordCallback
   * @param {Error|null} err - Error
   * @param {boolean} passwordValid - Whether the passwords are the same
   */
  /**
   * Compare raw password with encrypted password to determine if they are equal
   *
   * @private
   * @param  {string} password - raw password
   * @param  {string} encrypted - encrypted password
   * @param {comparePasswordCallback} callback - Callback called when passwords are compared
   * @return {boolean}
   */
  _comparePassword: function (password, encryptedPassowrd, callback) {
    bcrypt.compare(password, encryptedPassowrd, callback)
  }
})

module.exports = User
