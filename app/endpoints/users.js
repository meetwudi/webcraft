var router = require('express').Router()
var User = appRequire('app/models/User')

router.post('/users', function (req, res, next) {
  new User({ username: req.body.username, password: req.body.password })
    .save()
    .then(function (user) {
      return res.redirect('/login')
    }, function (err) {
      next(err)
    })
})

module.exports = router
