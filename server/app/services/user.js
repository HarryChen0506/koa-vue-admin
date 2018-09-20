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
    return UserModel.findOne({_id: id}).populate('role').exec()
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
    const list = await UserModel
                        .find(query, {password: 0})
                        .populate({path: 'role', match: {active: 1}, select: {rolename: 1}})
                        .skip(skipNum).limit(pageSize).sort(sort)

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
  },
  async update (schema = {}) {
    let {id, ...rest} = schema
    try {
      const isValid = await UserModel.findOne({_id: id})
      // console.log('isExist', isExist)
      if (!isValid) {
        throw '该用户不存在'
      }
    } catch (err) {
      throw new Error(err)
    }
    // 判断用户名是否重名
    if (schema.username) {
      try {
        const isExist = await UserModel.find({username: schema.username})
        // console.log('isExist', isExist)
        if (isExist.length > 0) {
          throw '该用户名已存在'
        }
      } catch (err) {
        throw new Error(err)
      }
    }
    return UserModel.update({_id: id}, {$set: {...rest}})
  }
}
module.exports = user
