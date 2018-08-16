const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')

const index = require('./app/routes/index')
const users = require('./app/routes/users')
const auth = require('./app/routes/auth')

// const accessLogger = require('./app/middlewares/accessLogger.js')
// const config = require('./app/config/index.js')(app)
// console.log('config info', config)

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// 自定义logger
// app.use(accessLogger())
app.use(require('koa-static')(path.join(__dirname, '/app/public')))
app.use(views(path.join(__dirname, '/app/views'), {
  extension: 'ejs'
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(auth.routes(), auth.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
module.exports = app
