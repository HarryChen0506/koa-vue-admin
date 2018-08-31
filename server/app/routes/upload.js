// 文件上传
const Router = require('koa-router')
const router = new Router({
  prefix: '/api/upload'
})

// 文件上传中间件
const uploadFileMid = require('../middlewares/uploadFile')()
// authToken中间件
// const authToken = require('../middlewares/authToken.js')()

const upload = require('../controllers/upload')

router.post('/image', upload.image)
router.post('/test', upload.test)
router.post('/file', uploadFileMid, async (ctx) => {
  const body = ctx.request.files
  body.base = ctx.uploadBaseDir
  ctx.body = JSON.stringify(body);
  console.log(ctx.request.files);
  // console.log(ctx.request.body);
  // ctx.body = {result: 123}
})
module.exports = router
