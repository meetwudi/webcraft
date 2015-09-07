var router = require('express').Router()

router.use(require('./session'))
router.use(require('./users'))

module.exports = router
