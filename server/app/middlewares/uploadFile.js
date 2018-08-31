// 文件上传中间件
'use strict'
const fs_service = require('../services/fs.js')
const path = require('path')
const koaBody = require('koa-body')
module.exports = (options, app) => {
  return async function uploadFile (ctx, next) {
    // 判断文件夹是否存在，不存在则创建
    const filePath = path.resolve(__dirname, '../../assets/upload/files/')
    const mkdirStatus = await fs_service.createDir(filePath)
    ctx.uploadBaseDir = '/upload/files/'
    // console.log('mkdirStatus', mkdirStatus)
    if (mkdirStatus) {
      await koaBody({
        multipart: true, // 支持文件上传
        encoding: 'gzip',
        formidable: {
          uploadDir: path.resolve(__dirname, '../../assets/upload/files/'), // 设置文件上传目录
          keepExtensions: true, // 保持文件的后缀
          maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
          onFileBegin: (name, file) => { // 文件上传前的设置
            // console.log(`name: ${name}`)
            // console.log('file', file)
          }
        }
      })(ctx, next)
    } else {
      await next()
    }
  }
}
