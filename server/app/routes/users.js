const Router = require('koa-router')
const router = new Router({
  prefix: '/api/users'
})
const user = require('../controllers/user');

router.get('/', user.index)
router.get('/:id', user.show)

module.exports = router
