// auth鉴权服务
'use strict'
const config = require('../config/index.js')()
const jwt = require('jsonwebtoken')
const auth = {
  async createAccessToken ({ userName, id }) {
    // 生成access_token
    const {authToken = {}} = config.middleware || {}
    const {exp, secret} = authToken
    const token = jwt.sign({
      userName,
      id,
      exp: Math.floor(Date.now() / 1000) + exp,
      secret: 'secret'
    }, secret)
    return token
  }
}
module.exports = auth
