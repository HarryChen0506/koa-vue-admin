// 生产环境配置
'use strict'

module.exports = (appInfo) => { 
  const config = {
    common: {
      custom_env: 'prod',
      prod_test: '123'
    }
  }
  return config
}
