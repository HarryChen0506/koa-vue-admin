// auth controller
const authService = require('../services/auth')
const util = require('../extends/util')

exports.login = async (ctx, next) => {
  const { query, params, request } = ctx
  let username, password
  if (request.method === 'GET') {
    username = query.username
    password = query.password
  } else if (request.method === 'POST') {
    username = request.body.username
    password = request.body.password
  }
  try {
    ctx.validate({
      username: 'string',
      password: 'string'
    }, { username, password })
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err)
    return
  }
  const user = await authService.login({username, password})
  console.log('user', user)
  if (!user) {
    // log
    ctx.dblog.info(`auth: ${username} login fail`)
    // 用户校验错误
    ctx.body = util.handleResult('fail', null, '用户名或密码不正确')
    return
  }
  // log
  ctx.dblog.info(`auth: ${username} login sucess`)
  // 生成token
  const token = await authService.createAccessToken({
    username,
    id: user._id
  })
  ctx.body = util.handleResult('success', {
    username: user.username,
    id: user._id,
    accessToken: token
  })
}

exports.register = async (ctx, next) => {
  // const { query, params } = ctx
  const {username, password} = ctx.request.body
  // 如果参数校验未通过，将会抛出一个 status = 422 的异常
  try {
     ctx.validate({
      username: 'string',
      password: 'string'
     }, { username, password })
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err)
    return
  }

  const user = await authService.getUserByUsername(username)
  if (user) {
    // 有重名用户
    ctx.body = util.handleResult('fail', null, '当前用户已注册,选择其他名字')
  } else {
    // 若检查正常则保存进数据库
    const {_id, create_time} = await authService.createUser({
      username,
      password
    })
    ctx.body = util.handleResult('success', {
      type: 'register',
      username,
      id: _id,
      createTime: Date.parse(create_time)
    })
  }
}
