'use strict'
const Router = require('koa-router')
const router = new Router({
  prefix: '/api/literature'
})

// const authToken = require('../middlewares/authToken.js')()
const literatureCtr = require('../controllers/literature')

router.get('/article/list', literatureCtr.article.list)
router.post('/article', literatureCtr.article.post)
router.put('/article', literatureCtr.article.put)
router.get('/category/list', literatureCtr.category.list)
router.post('/category', literatureCtr.category.post)
router.put('/category', literatureCtr.category.put)
router.get('/tag/list', literatureCtr.tag.list)
router.get('/tag/all', literatureCtr.tag.all)
router.post('/tag', literatureCtr.tag.post)
module.exports = router
