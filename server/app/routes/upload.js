// 文件上传
const Router = require('koa-router')
const router = new Router({
  prefix: '/api/upload'
})

// const authToken = require('../middlewares/authToken.js')()
const upload = require('../controllers/upload')

router.post('/image', upload.image)
router.post('/test', upload.test)

module.exports = router
