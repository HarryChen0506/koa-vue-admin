// user controller
const config = require('../config/index.js')()
exports.index = async (ctx, next) => {
  ctx.body = {
    text: 'this is a user response!!!'
  }
}
exports.show = async (ctx, next) => {
  ctx.log.info('logger text')
  ctx.body = {
    params: ctx.params,
    text: 'this is a user response!!!',
    env: process.env.node_env,
    custom_env: process.env.custom_env,
    config
  }
}
