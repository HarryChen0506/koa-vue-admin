// auth鉴权服务
'use strict'
const config = require('../config/index.js')()
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.js')()
const user = {  
  async getUserById (id) {
    if (!id) {
      return null
    }
    return UserModel.findOne({_id: id}).exec()
  }  
}
module.exports = user
