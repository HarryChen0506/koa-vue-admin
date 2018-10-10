// 微信小程序接口
'use strict'
const Router = require('koa-router')
const router = new Router({
  prefix: '/api/wechat'
})

// const authToken = require('../middlewares/authToken.js')()
const wechatCtr = require('../controllers/wechat')
const literatureCtr = require('../controllers/literature')

router.get('/wlyh/demo', wechatCtr.wlyh.demo)
router.post('/wlyh/logincode', wechatCtr.wlyh.logincode) // 用户发送logincode到后端
router.post('/wlyh/userinfo', wechatCtr.wlyh.updateUserInfo) // 更新用户信息
router.get('/wlyh/category/all', literatureCtr.category.all) // 获取所有分类列表
router.get('/wlyh/article/list', literatureCtr.article.list) // 获取文章列表（根据条件）
router.get('/wlyh/article/chapter/list', literatureCtr.chapter.list) // 获取文章章节列表（根据条件）
module.exports = router
