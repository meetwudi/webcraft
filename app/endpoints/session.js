var router = require('express').Router()
var passport = require('passport')
var localStrategy = appRequire('app/auth/local-strategy').localStrategy

passport.use(localStrategy)

router.post('/session',
  function (req, res, next) {
    passport.authenticate('local', function (err, user) {
      if (err) next(err)
      req.user = user
      next()
    })(req, res, next)
  },
  function (req, res, next) {
    if (req.user) {
      res.cookie(process.env.JWT_COOKIE_KEY, req.user.getJWT(), {
        httpOnly: true
      })
      return res.redirect('/')
    }
    else return res.redirect('/login')
  })

module.exports = router
