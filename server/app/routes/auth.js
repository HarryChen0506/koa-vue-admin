// 校验相关
const Router = require('koa-router')
const router = new Router({
  prefix: '/api/auth'
})
const auth = require('../controllers/auth');

router.post('/login', auth.login)

module.exports = router
