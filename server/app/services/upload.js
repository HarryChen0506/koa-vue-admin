// upload服务
'use strict'
const fs = require('fs')
const upload = {
  writeFile (fileName, dataBuffer) {
    // 写入文件
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, dataBuffer, err => {        
        if (err) {
          // console.log('fs.writeFile', err)
          reject(err)
        } else {
          resolve({result: 'success'})
        }
      })
    })
  }
}
module.exports = upload
