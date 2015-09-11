var router = require('express').Router()
var User = appRequire('app/models/User')
var passport = appRequire('app/init/passport')

router.post('/users', function (req, res, next) {
  User.registerUser({
    username: req.body.username,
    password: req.body.password
  }, req.body['confirmed_password']).then(function () {
    res.redirect('/login')
  }, function (err) {
    // TODO: add flash message here instead
    console.log(err)
    res.redirect('/register')
  })
})

var middlewares = {
  displayUserProfile: function (req, res, next) {
    return req.user.then(function (user) {
      res.json(user.serializeSafe())
    }, next)
  }
}

router.get('/profile', passport.authenticate('jwt'), middlewares.displayUserProfile)

module.exports = {
  router: router,
  middlewares: middlewares
}
