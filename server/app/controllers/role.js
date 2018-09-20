// user controller
const config = require('../config/index.js')()
const util = require('../extends/util')
const roleService = require('../services/role')

// 角色管理
// 角色列表
exports.index =  async (ctx, next) => {    
	const {query} = ctx
	console.log('query', query)
	try {
			const role = await roleService.getRoleByParams(query)
			ctx.dblog.info('auth: role query success')
			ctx.body = util.handleResult('success', role)
	} catch (err) {
			ctx.dblog.info('auth: role is not exist')
			// 用户校验错误
			ctx.body = util.handleResult('fail', null, err || '角色不存在')
	}
}
// 创建角色
exports.post = async (ctx, next) => {
  const {request} = ctx
  const {rolename, rolecode, ...rest} = request.body
  try {
    ctx.validate({
      rolename: 'string',
      rolecode: 'string'
    }, {rolename, rolecode})
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err)
    return
  }
  try {
    const result = await roleService.create({rolename, rolecode, ...rest})
    const {...role} = result._doc
    ctx.body = util.handleResult('success', role)
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err.message || '创建角色失败')
  }
}
// 更新角色
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
    const result = await roleService.update({id, ...rest})
    if (result) {
      ctx.body = util.handleResult('success', result)
    } else {
      ctx.body = util.handleResult('fail', null, '更新角色失败')
    }
  } catch (err) {
    ctx.body = util.handleResult('fail', null, err.message || '更新角色失败')
  }
}
// 所有角色
exports.all =  async (ctx, next) => {    
	const {query} = ctx
	try {
			const role = await roleService.getAllRoles(query)
			ctx.dblog.info('auth: role query success')
			ctx.body = util.handleResult('success', role)
	} catch (err) {
			ctx.dblog.info('auth: role is not exist')
			// 用户校验错误
			ctx.body = util.handleResult('fail', null, err || '角色不存在')
	}
}
