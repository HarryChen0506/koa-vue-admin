// 监测 accessToken 是否过期
'use strict'
const config = require('../config/index.js')()
const jwt = require('jsonwebtoken')
module.exports = (options, app) => {
  return async function authToken (ctx, next) {
    const {authToken = {}} = config.middleware || {}
    const {key, secret} = authToken
    const token = ctx.request.headers[key]
    try {
      jwt.verify(token, secret)
      await next()
      // 若通过校验,则添加access字段
      // ctx.body.access = true
    } catch (err) {
      if (err.message === 'jwt expired') {
        ctx.body = {
          success: false,
          access: false,
          detail: err.message || 'jwt expired'
        }
      } else {
        ctx.body = {
          success: false,
          access: false,
          detail: err.message || 'jwt invalid'
        }
      }
    }
  }
}
