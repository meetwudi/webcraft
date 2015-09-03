/**
 * Local strategy for passportjs
 * @module app/strategies/local-strategy
 */

var LocalStrategy = require('passport-local').Strategy
var User = appRequire('app/models/User')
var NotFoundError = require('bookshelf').Model.NotFoundError

/**
 * @property {object} localStrategy - Local strategy for passportjs
 * @public
 */
var localStrategy = new LocalStrategy(function (username, password, done) {
  User.getUserByUsername()
    .then(function (user) {
      return user.validatePassword(password)
    }, function (err) {
      if (typeof err instanceof NotFoundError) {
        return done(err, false, 'Incorrect')
      }
      else return done(err, false, 'Internal error')
    })
    // Validate password
    .then(function (isPasswordValid, user) {
      if (isPasswordValid) return done(null, user)
      else return done(null, false, 'Incorrect password')
    }, function (err) {
      return done(err, false, 'Internal error')
    })
})

module.exports = {
  localStrategy: localStrategy
}
