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
router.get('/category/all', literatureCtr.category.all)
router.post('/category', literatureCtr.category.post)
router.put('/category', literatureCtr.category.put)
router.get('/tag/list', literatureCtr.tag.list)
router.get('/tag/all', literatureCtr.tag.all)
router.post('/tag', literatureCtr.tag.post)
router.put('/tag', literatureCtr.tag.put)
router.get('/chapter/list', literatureCtr.chapter.list)
router.post('/chapter', literatureCtr.chapter.post)
router.put('/chapter', literatureCtr.chapter.put)
module.exports = router
