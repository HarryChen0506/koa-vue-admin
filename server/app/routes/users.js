const Router = require('koa-router')
const router = new Router({
  prefix: '/api/users'
})

const authToken = require('../middlewares/authToken.js')()
const user = require('../controllers/user')

router.get('/', authToken, user.index)
router.get('/:id', user.show)
module.exports = router
