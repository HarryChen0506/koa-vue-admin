// upload controller
// const config = require('../config/index.js')()
const fs = require('fs')
const path = require('path')
exports.image = async (ctx, next) => {
  const {imageName, data} = ctx.request.body;
  const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = new Buffer(base64Data, 'base64')
  // const filePath = path.resolve(__dirname, '../demo')
  const filePath = path.resolve(__dirname, '../../assets/images')
  // console.log('dir', __dirname)
  // console.log('.', path.resolve('.'))
  // const filePath = './app/demo'
  const fileName = path.join(filePath, imageName + '.png')
  console.log('fileName', fileName)
  fs.writeFile(fileName, dataBuffer, err => {
    console.log('fs', err)
    // if (err) {
    //   ctx.body = {
    //     text: 'this is a upload response!!!',
    //     result: 'fail'
    //   }
    // } else {
    //   ctx.body = {
    //     text: 'this is a upload response!!!',
    //     result: 'success'
    //   }
    // }
  })
}
