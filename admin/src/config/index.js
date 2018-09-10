// 配置文件入口
'use strict'

module.exports = () => {
  const config = {}
  config.accessKey = 'accessToken'
  config.whiteList = ['/login'] // 路由白名单
 
  return config
}

