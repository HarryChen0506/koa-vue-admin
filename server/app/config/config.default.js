// 默认配置
'use strict'
const ip = require('ip')
module.exports = (appInfo) => {
  const config = {}
  config.common = {
    name: 'config',
    custom_env: 'default'
  }
  config.middleware = {
    logger: {
      dir: 'logs',
      env: 'development',
      projectName: 'koa-admin',
      serverIp: ip.address() // 本项目所在服务器ip
    },
    // authToken鉴权配置
    authToken: {
      secret: 'secret',
      key: 'access_token', // 请求携带header
      exp: 1 * 60 * 60 * 24 * 30 // 过期时间30天
    }
  }
  config.plugin = {
    mongodb: {
      dbUrl: 'mongodb://user:!QAZ2wsx@127.0.0.1:27017/demo'
    }
  }

  return config
}
