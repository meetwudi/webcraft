/**
 * Local strategy for passportjs
 * @module app/strategies/local-strategy
 */

var LocalStrategy = require('passport-local').Strategy
var User = appRequire('app/models/User')
var NotFoundError = appRequire('app/init/database').bookshelf.Model.NotFoundError

/**
 * Authenticate user
 *
 * @param  {string}   username [description]
 * @param  {string}   password [description]
 * @param  {Function} done     [description]
 * @return {Promise}            [description]
 */
var _authenticateUser = function (username, password, done) {
  User.getUserByUsername()
    .then(function (user) {
      if (!user) return done(null, false, 'Wrong username')
      // Validate password
      user.validatePassword(password)
        .then(function (isPasswordValid) {
          if (isPasswordValid) return done(null, user)
          else return done(null, false, 'Incorrect password')
        }, function (err) {
          return done(err, false, 'Internal error')
        })
    }, function (err) {
      return done(err, false, 'Internal error')
    })
}

/**
 * @property {object} localStrategy - Local strategy for passportjs
 * @public
 */
var localStrategy = new LocalStrategy(_authenticateUser)

module.exports = {
  localStrategy: localStrategy,
  _authenticateUser: _authenticateUser
}
