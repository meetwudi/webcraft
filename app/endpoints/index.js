var router = require('express').Router()
var passport = require('passport')
var localStrategy = appRequire('app/auth/local-strategy').localStrategy

var loginEndpoint = require('./login')()

passport.use(localStrategy)

router.post('/login',
  function (req, res, next) {
    passport.authenticate('local', function (err, user) {
      if (err) next(err)
      req.user = user
      next()
    })(req, res, next)
  },
  loginEndpoint)

module.exports = router
