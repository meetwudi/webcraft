/**
 * User ORM
 *
 * @module app/models/User
 */
var bookshelf = appRequire('app/init/database').bookshelf
var databaseConfig = appRequire('app/config/database')
var bcrypt = require('bcrypt-nodejs')
var Promise = require('bluebird')
var dataRules = appRequire('app/config/data-rules')
var Checkit = require('checkit')
var jwt = require('jsonwebtoken')
var Project

/**
 * User ORM class
 *
 * @class
 */
var User = bookshelf.Model.extend({ // prototype properties
  tableName: databaseConfig.USERS_TABLE,

  getJWT: function () {
    var token = jwt.sign({
      user_id: this.get('id')
    }, process.env.JWT_SECRET)
    return token
  },

  /**
   * Check whether user has a project with the name (projectName)
   * @param  {string}  projectName - project name to check with
   * @return {Promise}
   */
  hasProjectName: function (projectName) {
    return this.projects().count({
      name: projectName
    }).then(function (count) {
      return count > 0
    })
  },

  initialize: function () {
    this.on('saving', this.validateSave)
  },

  projects: function () {
    return this.hasMany(Project)
  },

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
  },

  validateSave: function () {
    return User.getRules.run(this.attributes)
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
    return new User({ username: username })
      .fetch()
  },

  /**
   * Register an new user
   *
   * @param {object} attrs - Attributes of the user model
   * @param {string} confirmedPassword
   * @return {Promise}
   */
  registerUser: function (attrs, confirmedPassword) {
    return new Promise(function (resolve, reject) {
      if (attrs['password'] !== confirmedPassword) {
        reject(new Error('Password does not match confirmedPassword'))
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
  },

  getRules: new Checkit({
    id: 'integer',
    username: ['required',
      `maxLength:${dataRules.USERNAME_MAX_LENGTH}`,
      `minLength:${dataRules.USERNAME_MIN_LENGTH}`,
      'alphaNumeric'],
    password: ['required']
  })
})

User = bookshelf.model('User', User)
Project = bookshelf.model('Project') || appRequire('app/models/Project')

module.exports = User
