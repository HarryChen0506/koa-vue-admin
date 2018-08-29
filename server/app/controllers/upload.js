// upload controller
// const config = require('../config/index.js')()
const path = require('path')
const fs_service = require('../services/fs')
const util = require('../extends/util')

exports.image = async (ctx, next) => {
  const {data = ''} = ctx.request.body  
  let suffix = 'png' // 文件后缀
  const base64Data = data.replace(/^data:image\/(\w+);base64,/, (result, $1, offset) => {
    suffix = $1
    return ''
  })
  const dataBuffer = new Buffer(base64Data, 'base64')
  const filePath = path.resolve(__dirname, '../../assets/upload/images')
  let imageName = util.createImgName() + '.' + suffix
  const fileName = path.join(filePath, imageName)

  // 判断文件夹是否存在，不存在则创建
  const mkdirStatus = await fs_service.createDir(filePath)
  if (mkdirStatus) {
    let result
    try {
      result = await fs_service.writeFile(fileName, dataBuffer)
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
  const {data = ''} = ctx.request.body
  let suffix = 'png' // 文件后缀
  const base64Data = data.replace(/^data:image\/(\w+);base64,/, (result, $1, offset) => {
    suffix = $1
    return ''
  })
  console.log('suffix', suffix)
  const dataBuffer = new Buffer(base64Data, 'base64')
  const filePath = path.resolve(__dirname, '../../assets/demo/images')
  let imageName = util.createImgName() + '.' + suffix
  const fileName = path.join(filePath, imageName)

  // 判断文件夹是否存在，不存在则创建
  const mkdirStatus = await fs_service.createDir(filePath)
  if (mkdirStatus) {
    let result
    try {
      result = await fs_service.writeFile(fileName, dataBuffer)
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
