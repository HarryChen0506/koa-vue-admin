// 开发环境配置
'use strict'

module.exports = (appInfo) => {
  const config = {
    common: {
      custom_env: 'local',
      local_test: '123'
    },
    middleware: {

    },
    plugin: {}
  }
  return config
}
