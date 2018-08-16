const Router = require('koa-router')
const router = new Router({
  prefix: '/api/users'
})

const config = require('../config/index.js')()
const accessLogger = require('../middlewares/accessLogger.js')(config.middleware.accessLogger)
const user = require('../controllers/user')
console.log('config', config)

router.get('/', user.index)
router.get('/:id', accessLogger, user.show)
module.exports = router
