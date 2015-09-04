/**
 * User ORM
 *
 * @module app/models/User
 */

var bookshelf = appRequire('app/init/database').bookshelf
var databaseConfig = appRequire('app/config/database')
var bcrypt = require('bcrypt-nodejs')
var Promise = require('bluebird')
var validator = require('validator')
var dataRules = appRequire('app/config/data-rules')

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
        resolve(true)
      })
    })
  }
}, { // Class properties

  /**
   * Compare raw password with encrypted password to determine if they are equal
   *
   * @private
   */
  _comparePassword: bcrypt.compare,

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
   * Register an new user
   *
   * @param {object} attrs - Attributes of the user model
   * @param {string} confirmedPassword
   */
  registerUser: function (attrs, confirmedPassword) {
    return new Promise(function (resolve, reject) {
      if (!validator.equals(attrs.password, confirmedPassword)) {
        return reject(new Error('Password does not match confirmed password'))
      }
      if (!validator.isAlphanumeric(attrs.password)) {
        return reject(new Error('Password should be alphanumeric'))
      }
      if (!validator.isLength(attrs.password, dataRules.PASSWORD_MIN_LENGTH, dataRules.PASSWORD_MAX_LENGTH)) {
        return reject(new Error(`Password length should be within ${dataRules.PASSWORD_MIN_LENGTH} and ${dataRules.PASSWORD_MAX_LENGTH}`))
      }
      if (!validator.isAlphanumeric(attrs.username)) {
        return reject(new Error('Username should be alphanumeric'))
      }
      if (!validator.isLength(attrs.username, dataRules.USERNAME_MIN_LENGTH, dataRules.USERNAME_MAX_LENGTH)) {
        return reject(new Error(`Username length should be within ${dataRules.USERNAME_MIN_LENGTH} and ${dataRules.USERNAME_MAX_LENGTH}`))
      }

      // TODO: investigate better coding style for this
      // Ensure username is unique
      User.count({ username: attrs.username })
        .then(function (count) {
          if (count > 0) reject(new Error('Username exists'))
          attrs.password = bcrypt.hashSync(attrs.password)
          var user = new User(attrs)
          return user.save()
        }).then(resolve, reject)
    })
  }
})

module.exports = User
