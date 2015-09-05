var router = require('express').Router()

router.get('/', function (req, res) {
  res.render('empty')
})

router.get('/login', function (req, res) {
  res.render('empty')
})

module.exports = router
