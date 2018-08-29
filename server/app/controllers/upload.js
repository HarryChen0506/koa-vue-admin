// upload controller
// const config = require('../config/index.js')()
const path = require('path')
const fs = require('fs')
const upload_service = require('../services/upload')
const fs_service = require('../services/fs')

exports.image = async (ctx, next) => {
  const {imageName, data} = ctx.request.body;
  const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = new Buffer(base64Data, 'base64')
  const filePath = path.resolve(__dirname, '../../assets/upload/images')
  const fileName = path.join(filePath, imageName + '.png')
  // 判断文件夹是否存在，不存在则创建
  const mkdirStatus = await fs_service.createDir(filePath)
  if (mkdirStatus) {
    let result
    try {
      result = await upload_service.writeFile(fileName, dataBuffer)
      ctx.body = {
        result: result
      }
    } catch (err) {
      throw new Error(err)
    }
  } else {
    ctx.body = {
      result: 'fail'
    }
  }
}

// 测试
exports.test = async (ctx, next) => {
  const {imageName, data} = ctx.request.body;
  const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = new Buffer(base64Data, 'base64')
  const filePath = path.resolve(__dirname, '../../assets/demo/images')
  const fileName = path.join(filePath, imageName + '.png')
  // 判断文件夹是否存在，不存在则创建
  const mkdirStatus = await fs_service.createDir(filePath)
  if (mkdirStatus) {
    let result
    try {
      result = await upload_service.writeFile(fileName, dataBuffer)
      ctx.body = {
        result: result
      }
    } catch (err) {
      throw new Error(err)
    }
  } else {
    ctx.body = {
      result: 'fail'
    }
  }
}
