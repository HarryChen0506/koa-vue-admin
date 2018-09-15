// upload服务
'use strict'
const path = require('path')
const crypto = require('crypto')
const fs_service = require('./fs.js')
const util = require('../extends/util')
const upload = {
  /**
   * 图片上传
   * @param {*} options 
   * options.data 图片base64数据
   * options.baseDir 静态资源文件夹
   * options.imagePath 图片保存的文件路径
   * options.host
   */
  async imageUpload (options) {
    // 写入文件
    return new Promise(async (resolve, reject) => {
      const baseDir = options.baseDir || '../public'
      const imagePath = options.imagePath || '/upload/images/'
      const host = options.host || '127.0.0.1:80'
      let suffix = 'png' // 文件后缀
      const base64Data = options.data.replace(/^data:image\/(\w+);base64,/, (result, $1, offset) => {
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
            resolve({
              filePath: `${imagePath}${imageName}`,
              host: host,
              protocol: 'http',
              url: `http://${host}${imagePath}${imageName}`
            })
          } else {
            resolve(false)
          }
        } catch (err) {
          reject(err)
        }
      }
    })
  },

  async ossSign (options) {
    return new Promise(async (resolve, reject) => {
      const config = {
        dirPath: 'oss/file/', // oss 文件夹 不存在会自动创建
        bucket: 'static01-harry', // oss应用名
        region: 'oss-cn-hangzhou', // oss节点名
        accessKeyId: 'LTAIyRZ7GVhw11Ns', // 申请的osskey
        accessKeySecret: 'qz3mjrJkH8YB39B854BhdbYjDVm5q5', // 申请的osssecret
        expAfter: 60000, // 签名失效时间
        maxSize: 1048576000 // 最大文件大小
      }
      const {bucket, region, expAfter, maxSize, dirPath, accessKeyId, accessKeySecret} = config

      const host = `http://${bucket}.${region}.aliyuncs.com` // 你的oss完整地址
      const expireTime = new Date().getTime() + expAfter
      const expiration = new Date(expireTime).toISOString()
      const policyString = JSON.stringify({
        expiration,
        conditions: [
          ['content-length-range', 0, maxSize],
          ['starts-with', '$key', dirPath]
        ]
      })
      const policy = Buffer(policyString).toString('base64')
      const Signature = crypto.createHmac('sha1', accessKeySecret).update(policy).digest('base64')
      const result = {
        Signature,
        policy,
        host,
        'OSSAccessKeyId': accessKeyId,
        'key': dirPath + expireTime,
        'success_action_status': 200,
        dirPath
      }
      resolve(result)
    })
  }
}
module.exports = upload
