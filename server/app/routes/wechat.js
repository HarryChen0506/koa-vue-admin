// 微信小程序接口
'use strict'
const Router = require('koa-router')
const router = new Router({
  prefix: '/api/wechat'
})

// const authToken = require('../middlewares/authToken.js')()
const wechatCtr = require('../controllers/wechat')

router.get('/wlyh/demo', wechatCtr.wlyh.demo)
router.post('/wlyh/logincode', wechatCtr.wlyh.logincode) // 用户发送logincode到后端
router.post('/wlyh/userinfo', wechatCtr.wlyh.updateUserInfo) // 更新用户信息
module.exports = router
