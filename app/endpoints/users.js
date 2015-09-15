var router = require('express').Router()
var User = appRequire('app/models/User')
var passport = appRequire('app/init/passport')

router.post('/users', function (req, res, next) {
  User.registerUser({
    username: req.body.username,
    password: req.body.password
  }, req.body['confirmed_password']).then(function (user) {
    return res.status(201).json(user.serializeSafe())
  }, function (err) {
      // TODO: add flash message here instead
      return res.status(400).json({
        error: err.message
      })
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
