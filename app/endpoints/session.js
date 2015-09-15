var router = require('express').Router()
var passport = appRequire('app/init/passport')

router.post('/session',
  passport.authenticate('local', {
    session: false
  }),
  function (req, res, next) {
    if (req.user) {
      return res.json({
        jwt: req.user.getJWT()
      })
    }
  })

router.delete('/session', function (req, res, next) {
  res.clearCookie()
  return res.redirect('/')
})

module.exports = {
  router: router
}
