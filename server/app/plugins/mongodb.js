// mongodb数据库插件
'use strict'

const mongoose = require('mongoose')
const config = require('../config/index.js')()
module.exports = (options) => {
  const {dbUrl} = config.plugin.mongodb
  // 链接数据库
  mongoose.connect(dbUrl)
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
