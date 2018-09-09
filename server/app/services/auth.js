// auth鉴权服务
'use strict'
const config = require('../config/index.js')()
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.js')()
const auth = {
  async createAccessToken ({ username, id }) {
    // 生成access_token
    const {authToken = {}} = config.middleware || {}
    const {exp, secret, key} = authToken
    const token = jwt.sign({
      username,
      id,
      key,
      exp: Math.floor(Date.now() / 1000) + exp
    }, secret)
    return token
  },
  async login ({username, password}) {
    if (!username || !password) {
      return null
    }
    return UserModel.findOne({username, password}).exec()   
  },
  async getUserByUsername (username) {
    if (!username) {
      return null
    }
    return UserModel.findOne({username}).exec()
  },
  async createUser ({username, password}) {
    if (!username || !password) {
      return null
    }
    const user = new UserModel({
      username,
      password
    })
    return user.save()
  }
}
module.exports = auth
