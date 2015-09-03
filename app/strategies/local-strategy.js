/**
 * Local strategy for passportjs
 * @module app/strategies/local-strategy
 */

var LocalStrategy = require('passport-local').Strategy
var db = appRequire('app/db')
var bcrypt = require('bcrypt-nodejs')

/**
 * @property {object} localStrategy - Local strategy for passportjs
 * @public
 */
var localStrategy = new LocalStrategy(function (username, password, done) {
  db.pg.connect(db.config.CONN_STRING, function (err, client, done) {
    if (err) return done(err, false, { message: 'Internal error' })
    client.query(db.users.select().where(
      db.users.username.equals(username)
    ).toQuery().text, function (err, results) {
      if (err) return done(err, false, { message: 'Internal error' })
      // No such user
      if (!results.rows.length) return done(null, false, { message: 'Wrong username or password' })
      // Compare password
      _comparePassword(password, results.rows[0].password, function (err, passwordValid) {
        if (err) return done(err, false, { message: 'Internal error' })
        if (!passwordValid) return done(null, false, { message: 'Wrong username or password' })
        // TODO: Apply model here
        done(null, results.rows[0])
      })
    })
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
