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
    let {pageSize = 10, pageNum = 1, ...rest} = params
    pageSize = parseInt(pageSize)
    pageNum = parseInt(pageNum)

    const query = {}
    Object.keys(rest).forEach(v => {
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

    const skipNum = (pageNum - 1) * pageSize
    const sort = {'create_time': -1}

    const total = await UserModel.find(query).count()
    const list = await UserModel.find(query, {password: 0}).skip(skipNum).limit(pageSize).sort(sort)

    return {
      list,
      total
    }
  },
  async create (schema = {}) {
    let {username, password, ...rest} = schema
    try {
      const isExist = await UserModel.find({username})
      // console.log('isExist', isExist)
      if (isExist.length > 0) {
        throw '该用户已存在'
      }
    } catch (err) {
      throw new Error(err)
    }    
    if (!username || !password) {
      return null
    }
    let newUser = new UserModel({username, password, ...rest})
    return newUser.save()
  }
}
module.exports = user
