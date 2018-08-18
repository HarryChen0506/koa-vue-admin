// mongodb数据库插件
'use strict'

const mongoose = require('mongoose')
// const config = require('../config/index.js')()
module.exports = (appInfo) => {
  const {config} = appInfo
  const {dbUrl} = config.plugin.mongodb
  // 链接数据库
  mongoose.connect(dbUrl, {useNewUrlParser: true})
  // 监听是否链接成功
  mongoose.connection.on('connected', function () {
    console.log('MongoDB connected success...')
  })
  mongoose.connection.on('error', function () {
    console.log('MongoDB connected fail.')
  })
  mongoose.connection.on('disconnected', function () {
    console.log('MongoDB connected disconnected.')
  })
}
