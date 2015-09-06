var passport = require('passport')
var localStrategy = appRequire('app/auth/local-strategy').localStrategy
var User = appRequire('app/models/User')

passport.use(localStrategy)

passport.serializeUser(function (user, done) {
  done(null, user.get('id'))
})

passport.deserializeUser(function (id, done) {
  new User({ id: id })
    .fetch()
    .then(done, done)
})

module.exports = passport
