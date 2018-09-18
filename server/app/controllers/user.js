// user controller
const config = require('../config/index.js')()
const util = require('../extends/util')
const userService = require('../services/user')

// 根据条件查询用户
exports.index = async (ctx, next) => {
  const {query} = ctx
  console.log('query', query)
  try {
    const user = await userService.getUserByParams(query)
    ctx.dblog.info('auth: user query success')
    ctx.body = util.handleResult('success', user)
  } catch (err) {
    ctx.dblog.info('auth: user is not exist')
    // 用户校验错误
    ctx.body = util.handleResult('fail', null, err || '用户不存在')
  }
}
exports.show = async (ctx, next) => {
  ctx.body = {
    cookie: ctx.request.header.cookie,
    dir: __dirname,
    params: ctx.params,
    text: 'this is a user response!!!',
    env: process.env.node_env,
    custom_env: process.env.custom_env,
    config
  }
}
// 根据id查询用户信息
exports.info = async (ctx, next) => {
  const { query, params, request } = ctx
  let id
  if (request.method === 'GET') {
    id = params.id
  } else if (request.method === 'POST') {
    id = request.body.id
  }
  try {
    ctx.validate({
      id: 'string'
    }, {id})
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err)
    return
  }
  const user = await userService.getUserById(id)
  console.log('user', user)
  if (!user) {
    // log
    ctx.dblog.info(`auth: userId ${id} login fail`)
    // 用户校验错误
    ctx.body = util.handleResult('fail', null, '该用户不存在')
    return
  }
  // log
  ctx.dblog.info(`auth: userId ${id} login sucess`) 
  ctx.body = util.handleResult('success', {
    username: user.username,
    id: user._id
  })
}
// 新增用户
exports.post = async (ctx, next) => {
  const {request} = ctx
  const {username, password, ...rest} = request.body
  try {
    ctx.validate({
      username: 'string',
      password: 'string'
    }, {username, password})
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err)
    return
  }
  try {
    const result = await userService.create({username, password, ...rest})
    const {...user} = result._doc
    delete user.password
    ctx.body = util.handleResult('success', user)
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err.message || '创建用户失败')
  }
}
// 更新用户
exports.put = async (ctx, next) => {
  const {request} = ctx
  const {id, ...rest} = request.body
  try {
    ctx.validate({
      id: 'string'
    }, {id})
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err)
    return
  }
  try {
    const result = await userService.update({id, ...rest})
    // { ok: 1, nModified: 1, n: 1 }
    if (result.ok === 1) {
      ctx.body = util.handleResult('success', true)
    } else {
      ctx.body = util.handleResult('fail', null, '更新用户失败')
    }
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err.message || '更新用户失败')
  }
}

// 角色管理
const role = {
  async index (ctx, next) {
    console.log('role')
    ctx.body = util.handleResult('success', true)
  }
}

exports.role = role