// 生产环境配置
'use strict'
const ip = require('ip')
module.exports = (appInfo) => {
  const config = {
    common: {
      custom_env: 'prod',
      prod_test: '123'
    },
    middleware: {
      logger: {
        // dir: '/opts/logs', // 生产环境放在根目录下
        env: 'production',
        projectName: 'koa-admin-prod',
        serverIp: ip.address() // 本项目所在服务器ip
      }
    }
  }
  return config
}
