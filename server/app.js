const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const path = require('path')

// 中间件和插件
const logger = require('./app/middlewares/logger')
const mongodb = require('./app/plugins/mongodb')
const errorHandler = require('./app/middlewares/errorHandler')
const validate = require('./app/middlewares/validate')
// 路由
const index = require('./app/routes/index')
const users = require('./app/routes/users')
const auth = require('./app/routes/auth')
const upload = require('./app/routes/upload')

const config = require('./app/config/index.js')(app)
// console.log('app.config', app.config)
// console.log('app.js __dirname', __dirname)
// console.log('assets __dirname', path.join(__dirname, 'assets/images'))

// error handler
onerror(app)

// middlewares
app.use(errorHandler())
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// 自定义logger
app.use(logger(config.middleware.logger))



// 静态资源
app.use(require('koa-static')(path.join(__dirname, '/app/public')))
app.use(require('koa-static')(path.join(__dirname, '/assets')))

app.use(views(path.join(__dirname, '/app/views'), {
  extension: 'ejs'
}))

// 校验参数中间件
app.use(validate())

// 数据库mongoose
mongodb(app)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(auth.routes(), auth.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
module.exports = app
