// 自定义日志中间件
'use strict'
// const config = require('../config/index.js')()
module.exports = (options, app) => {
  return async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    // console.log('access congig', config)
    console.log(`info ${ctx.method} ${ctx.url} - ${ms}ms`)
  }
}
