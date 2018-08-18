// 配置文件入口
'use strict'
const app = require('../../app.js')
// config 配置选项
const configList = [
  'common',
  'plugin',
  'middleware'
]
module.exports = (appInfo) => {
  appInfo = appInfo || app
  const NODE_ENV = nodeEnv()
  const CONFIG_DEFAULT = require('./config.default')(appInfo)
  const CONFIG_LOCAL = require('./config.local')(appInfo)
  const CONFIG_PROD = require('./config.prod')(appInfo)

  let config = {}
  switch (NODE_ENV) {
  case 'development':
    config = mergeConfig(CONFIG_DEFAULT, CONFIG_LOCAL)
    break
  case 'production':
    config = mergeConfig(CONFIG_DEFAULT, CONFIG_PROD)
    break
  default:
    config = Object.assign(CONFIG_DEFAULT)
  }
  // 将config挂载到app上
  appInfo.config = config
  return config
}

function nodeEnv () {
  let NODE_ENV = process.env.node_env || 'development'
  return NODE_ENV
}
/**
 * 合并config对象
 * @param {*} source 合并源
 * @param {*} target 合并目标
 */
function mergeConfig (source, target) {
  const result = {}
  configList.forEach(v => {
    result[v] = {...source[v], ...target[v]}
  })
  return result
}
