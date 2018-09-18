// auth鉴权服务
'use strict'
// const config = require('../config/index.js')()
// const jwt = require('jsonwebtoken')
const RoleModel = require('../models/role.js')()
const role = {
  async getRoleById (id) {
    if (!id) {
      return null
    }
    return RoleModel.findOne({_id: id}).exec()
  },
  async getRoleByParams (params = {}) {
    // const {rolename, rolecode, id} = params
    let {pageSize = 10, pageNum = 1, ...rest} = params
    pageSize = parseInt(pageSize)
    pageNum = parseInt(pageNum)

    const query = {}
    Object.keys(rest).forEach(v => {
      if (params[v]) {
        if (v === 'id') {
          query['_id'] = params[v]
        } else if (v === 'rolename') {
          // 模糊查询
          query['rolename'] = {$regex: params[v]}
        } else {
          query[v] = params[v]
        }
      }
    })

    const skipNum = (pageNum - 1) * pageSize
    const sort = {'create_time': -1}

    const total = await RoleModel.find(query).count()
    const list = await RoleModel.find(query, {delete: 0}).skip(skipNum).limit(pageSize).sort(sort)

    return {
      list,
      total
    }
  },
  async create (schema = {}) {
    let {rolename, rolecode, ...rest} = schema
    if (!rolename || !rolename) {
      return null
    }
    try {
      const isExist = await RoleModel.find({$or: [{rolename}, {rolecode}]})
      // console.log('isExist', isExist)
      if (isExist.length > 0) {
        throw '该角色名或角色码已存在'
      }
    } catch (err) {
      throw new Error(err)
    }
   
    let newUser = new RoleModel({rolename, rolecode, ...rest})
    return newUser.save()
  },
  async update (schema = {}) {
    let {id, ...rest} = schema
    
    // 判断角色名是否重名
    if (schema.rolename || schema.rolecode) {
      try {
        const isExist = await RoleModel.find(
          {
            $or: [{
                rolename: schema.rolename,
                _id: {$ne: id}
              }, {
                rolecode: schema.rolecode,
                _id: {$ne: id}
            }]
          }) // {$or: [{rolename},{rolecode}]}
        if (isExist.length > 0) {
          throw '该角色名或角色码已存在'
        }
      } catch (err) {
        throw new Error(err)
      }
    }
    return RoleModel.findOneAndUpdate({_id: id}, {$set: {...rest}})
  }
}
module.exports = role
