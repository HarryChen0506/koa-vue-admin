// 自定义日志中间件
'use strict'

module.exports = (options, app) => {
  return async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`info ${ctx.method} ${ctx.url} - ${ms}ms`)
  }
}
