// upload controller
// const config = require('../config/index.js')()
const path = require('path')
const fs_service = require('../services/fs')
const upload_service = require('../services/upload')
const util = require('../extends/util')

exports.test = async (ctx, next) => {
  const baseDir = '../../assets' // upload文件静态资源根目录
  const imagePath = '/upload/images/' // 文件具体路径
  const {data = ''} = ctx.request.body
  let suffix = 'png' // 文件后缀
  const base64Data = data.replace(/^data:image\/(\w+);base64,/, (result, $1, offset) => {
    suffix = $1
    return ''
  })
  const dataBuffer = new Buffer(base64Data, 'base64')
  // filePath 图片存放文件夹
  const filePath = path.resolve(__dirname, baseDir + imagePath)
  let imageName = util.createImgName() + '.' + suffix
  const fileName = path.join(filePath, imageName)

  // 判断文件夹是否存在，不存在则创建
  const mkdirStatus = await fs_service.createDir(filePath)
  if (mkdirStatus) {
    try {
      const result = await fs_service.writeFile(fileName, dataBuffer)
      if (result) {
        console.log('host', ctx.request.header)
        ctx.body = util.handleResult('success', {
          filePath: `${imagePath}${imageName}`,
          host: ctx.request.header['host']
        })
      } else {
        ctx.body = util.handleResult('fail', null, '上传图片失败')
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}

// 测试
exports.image = async (ctx, next) => {
  const baseDir = '../../assets' // upload文件静态资源根目录
  const imagePath = '/upload/images/' // 文件具体路径
  const {data = ''} = ctx.request.body

  // 判断文件夹是否存在，不存在则创建
  try {
    const uploadResult = await upload_service.imageUpload({
      data: data,
      baseDir: baseDir,
      imagePath: imagePath,
      host: ctx.request.header.host
    })
    if (uploadResult) {
      ctx.body = util.handleResult('success', uploadResult)
    } else {
      ctx.body = util.handleResult('fail', null, '上传图片失败')
    }
  } catch (err) {
    throw new Error(err)
  }
}

// 阿里云oss
exports.ossSign = async (ctx, next) => {
  // 获取policy
  try {
    const result = await upload_service.ossSign()
    ctx.body = util.handleResult('success', result)
  } catch (err) {
    throw new Error(err)
  }
}
