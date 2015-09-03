/**
 * Local strategy for passportjs
 * @module app/strategies/local-strategy
 */

var LocalStrategy = require('passport-local').Strategy
var User = appRequire('app/models/User')
var bcrypt = require('bcrypt-nodejs')

/**
 * @property {object} localStrategy - Local strategy for passportjs
 * @public
 */
var localStrategy = new LocalStrategy(function (username, password, done) {
  User.collection()
    .query()
    .where({ username: username })
    .fetchOne()
    .then(function (user) {
      var encryptedPassword = user.get('password')
      _comparePassword(password, encryptedPassword, function (err, passwordValid) {
        if (err) return done(err, false, 'Internal error')
        if (!passwordValid) return done(null, false, 'Incorrect password')
        done(null, user)
      })
    }, function (err) {
      done(err, false, 'Internal error')
    })
})

/**
 * Callback called when passwords are compared
 * @private
 * @callback comparePasswordCallback
 * @param {Error|null} err - Error
 * @param {boolean} passwordValid - Whether the passwords are the same
 */
/**
 * Compare raw password with encrypted password to determine if they are equal
 * @private
 * @param  {string} password - raw password
 * @param  {string} encrypted - encrypted password
 * @param {comparePasswordCallback} callback - Callback called when passwords are compared
 * @return {boolean}
 */
function _comparePassword (password, encryptedPassowrd, callback) {
  bcrypt.compare(password, encryptedPassowrd, callback)
}

module.exports = {
  localStrategy: localStrategy,
  _comparePassword: _comparePassword
}
