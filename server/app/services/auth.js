// auth鉴权服务
'use strict'
const config = require('../config/index.js')()
const jwt = require('jsonwebtoken')
const auth = {
  async createAccessToken ({ userName, id }) {
    // 生成access_token
    const {authToken = {}} = config.middleware || {}
    const {exp, secret, key} = authToken
    const token = jwt.sign({
      userName,
      id,
      key,
      exp: Math.floor(Date.now() / 1000) + exp
    }, secret)
    return token
  }
}
module.exports = auth
