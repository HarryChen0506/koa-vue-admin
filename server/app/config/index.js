// 配置文件入口
'use strict'

module.exports = (appInfo) => {
  const config = {
    name: 'config',
    custom_env: 'default',
    node_env: process.env.node_env
  }
  return config
}
