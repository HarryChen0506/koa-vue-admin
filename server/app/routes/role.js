const Router = require('koa-router')
const router = new Router({
  prefix: '/api/role'
})

// const authToken = require('../middlewares/authToken.js')()
const role = require('../controllers/role')

router.get('/', role.index)
router.post('/', role.post)
router.put('/', role.put)
router.get('/all', role.all)
module.exports = router
