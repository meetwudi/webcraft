var router = require('express').Router()

router.get('/', function (req, res) {
  res.render('empty')
})

module.exports = router
