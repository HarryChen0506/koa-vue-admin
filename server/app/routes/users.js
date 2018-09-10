const Router = require('koa-router')
const router = new Router({
  prefix: '/api/users'
})

const authToken = require('../middlewares/authToken.js')()
const user = require('../controllers/user')

router.get('/', authToken, user.index)
router.get('/:id', authToken, user.info)
router.get('/demo/show', authToken, user.show)
module.exports = router
