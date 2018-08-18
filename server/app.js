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
// 路由
const index = require('./app/routes/index')
const users = require('./app/routes/users')
const auth = require('./app/routes/auth')

const config = require('./app/config/index.js')(app)
// console.log('app.config', app.config)

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

app.use(require('koa-static')(path.join(__dirname, '/app/public')))
app.use(views(path.join(__dirname, '/app/views'), {
  extension: 'ejs'
}))

// 数据库mongoose
mongodb(app)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(auth.routes(), auth.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
module.exports = app
