var router = require('express').Router()

router.use(require('./session').router)
router.use(require('./users').router)
router.use(require('./projects/docs').router)
router.use(require('./projects').router)

module.exports = router
