// 默认配置
'use strict'

module.exports = (appInfo) => {
  const config = {
    name: 'config',
    custom_env: 'default'
  }
  config.middleware = {
    accessLogger: {
      info: 'access'
    },
    // authToken鉴权配置
    authToken: {
      secret: 'secret',
      key: 'access_token', // 请求携带header
      exp: 1 * 60 * 60 * 24 * 30 // 过期时间30天
    }
  }

  return config
}
