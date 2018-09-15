// auth鉴权服务
'use strict'
// const config = require('../config/index.js')()
// const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.js')()
const user = {
  async getUserById (id) {
    if (!id) {
      return null
    }
    return UserModel.findOne({_id: id}).exec()
  },
  async getUserByParams (params = {}) {
    // const {username, nickname, id} = params
    const query = {}
    Object.keys(params).forEach(v => {
      if (params[v]) {
        if (v === 'id') {
          query['_id'] = params[v]        
        } else if (v === 'username') {
          // 模糊查询
          query['username'] = {$regex: params[v]}
        } else {
          query[v] = params[v]
        }
      }
    })
    console.log('query', query)
    return UserModel.find(query, {password: 0}).exec()
  }
}
module.exports = user
