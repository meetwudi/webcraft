var passport = require('passport')
var localStrategy = appRequire('app/auth/local-strategy').localStrategy
var jwtStrategy = appRequire('app/auth/jwt-strategy').jwtStrategy

passport.use(localStrategy)
passport.use(jwtStrategy)

passport.serializeUser(function (user, done) {
  done(null, user.get('id'))
})

module.exports = passport
