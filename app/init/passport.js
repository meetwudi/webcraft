var passport = require('passport')
var localStrategy = appRequire('app/auth/local-strategy').localStrategy
var jwtStrategy = require('app/auth/jwt-strategy').jwtStrategy
var User = appRequire('app/models/User')

passport.use(localStrategy)
passport.use(jwtStrategy)

passport.serializeUser(function (user, done) {
  done(null, user.get('id'))
})

module.exports = passport
