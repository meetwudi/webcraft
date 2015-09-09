var router = require('express').Router()
var passport = appRequire('app/init/passport')

router.post('/session',
  passport.authenticate('local', {
    failureRedirect: '/login',
    session: false
  }),
  function (req, res, next) {
    if (req.user) {
      res.cookie(process.env.JWT_COOKIE_KEY, req.user.getJWT(), {
        httpOnly: true
      })
      return res.redirect('/')
    }
  })

router.delete('/session', function (req, res, next) {
  res.clearCookie()
  return res.redirect('/')
})

module.exports = {
  router: router
}
