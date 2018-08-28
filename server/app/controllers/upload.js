// upload controller
// const config = require('../config/index.js')()
const fs = require('fs')
const path = require('path')
const upload_service = require('../services/upload')

exports.image = async (ctx, next) => {
  const {imageName, data} = ctx.request.body;
  const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = new Buffer(base64Data, 'base64')
  // const filePath = path.resolve(__dirname, '../demo')
  const filePath = path.resolve(__dirname, '../../assets/upload/images')
  // console.log('dir', __dirname)
  // console.log('.', path.resolve('.'))
  // const filePath = './app/demo'
  const fileName = path.join(filePath, imageName + '.png')
  // console.log('fileName', fileName)
  let result
  try {
    result = await upload_service.writeFile(fileName, dataBuffer)
    // result.fileName = fileName.split(path.sep).join('/')
    result.fileName = `/upload/images/${imageName}.png`
    result.host = ctx.request.header.host
    result.filePath = result.host + result.fileName
    ctx.body = {
      ...result      
    }
  } catch (err) {    
    throw new Error(err)
  } 
 
}
