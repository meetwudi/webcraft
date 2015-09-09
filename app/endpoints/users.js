var router = require('express').Router()
var User = appRequire('app/models/User')

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

module.exports = router
