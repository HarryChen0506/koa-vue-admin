const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  console.log('中间件')
  // 在此可以添加校验中间件
  return await next();
}, async (ctx, next) => {
  console.log('koa')
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
