// 文件操作服务
'use strict'
const fs = require('fs')
const path = require('path')

const fs_service = {
  // 查询文件状态 是否存在
  getStat (path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats);
        }
      })
    })
  },
  // 判断文件夹是否存在
  async dirExists (dir) {
    let isExists = await this.getStat(dir)
    // 如果该路径且不是文件夹，返回true
    if (isExists && isExists.isDirectory()) {
      return true
    } else if (isExists) { // 如果该路径存在但是文件，返回false
      return false
    }
    return false
  },
  // 创建文件夹
  async mkdir (dir) {
    return new Promise((resolve, reject) => {    
      fs.mkdir(dir, err => {
        if (err) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  },
  // 生成指定路径的文件夹，通过递归实现
  async createDir (dir) {
    const isDirExists = await this.dirExists(dir)
    if (isDirExists) {
      // console.log('该文件夹已存在')
      return true
    }
    // 文件夹不存在，则判断上级目录
    const tempDir = path.parse(dir).dir // 拿到上级路径
    // console.log('tempDir', tempDir)
    const status = await this.createDir(tempDir)
    // console.log('status', status)
    let mkdirStatus
    if (status) {
      mkdirStatus = await this.mkdir(dir)
    }
    return mkdirStatus
  },
  // 写入文件
  writeFile (fileName, dataBuffer) {
    // 写入文件
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, dataBuffer, err => {
        if (err) {
          // console.log('fs.writeFile', err)
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
}
module.exports = fs_service
