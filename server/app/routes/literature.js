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

module.exports = router
