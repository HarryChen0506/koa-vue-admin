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
    }
  }
  return config
}
