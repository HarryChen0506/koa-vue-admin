// 文件上传
const Router = require('koa-router')
const router = new Router({
  prefix: '/api/upload'
})

// 文件上传中间件
const {beforeUpload, uploadFile, uploadResult} = require('../middlewares/uploadFile')
// authToken中间件
// const authToken = require('../middlewares/authToken.js')()

const upload = require('../controllers/upload')

router.post('/image', upload.image)
router.post('/test', upload.test)
router.post('/file', beforeUpload(), uploadFile(), uploadResult())
module.exports = router
