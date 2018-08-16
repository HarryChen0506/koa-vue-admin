// 配置文件入口
'use strict'
const app = require('../../app.js')
module.exports = (appInfo) => {
  appInfo = appInfo || app
  const NODE_ENV = nodeEnv()
  const CONFIG_DEFAULT = require('./config.default')(appInfo)
  const CONFIG_LOCAL = require('./config.local')(appInfo)
  const CONFIG_PROD = require('./config.prod')(appInfo)

  let config = {}
  switch (NODE_ENV) {
  case 'development':
    config = Object.assign(CONFIG_DEFAULT, CONFIG_LOCAL)
    break
  case 'production':
    config = Object.assign(CONFIG_DEFAULT, CONFIG_PROD)
    break
  default:
    config = Object.assign(CONFIG_DEFAULT)
  }
  return config
}

function nodeEnv () {
  let NODE_ENV = process.env.node_env || 'development'
  return NODE_ENV
}
