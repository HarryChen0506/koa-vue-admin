// 文件上传中间件
'use strict'
const fs_service = require('../services/fs.js')
const util = require('../extends/util')
const path = require('path')
const koaBody = require('koa-body')

// 配置
const dirPath = '../../assets/upload/files/' // 文件存储路径
const staticPath = '/upload/files/' // 静态资源访问路径

// 上传前检测文件夹是否存在，不存在则创建
exports.beforeUpload = (options, app) => {
  return async function beforeUpload (ctx, next) {
    // 判断文件夹是否存在，不存在则创建
    const filePath = path.resolve(__dirname, dirPath)
    const mkdirStatus = await fs_service.createDir(filePath)
    // console.log('mkdirStatus', mkdirStatus)
    if (mkdirStatus) {
      await next()
    } else {
      ctx.body = {
        success: false,
        detail: '创建文件夹失败'
      }
    }
  }
}

// 上传文件
exports.uploadFile = (options, app) => {
  return koaBody({
    multipart: true, // 支持文件上传
    encoding: 'gzip',
    formidable: {
      uploadDir: path.resolve(__dirname, dirPath), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name, file) => { // 文件上传前的设置
        // console.log('file', file)
        // 获取文件后缀
        const ext = getUploadFileExt(file.name);
        // 最终要保存到的文件夹目录
        const dirName = getUploadDirName()
        const dir = path.join(__dirname, `${dirPath}${dirName}`);
        // 检查文件夹是否存在如果不存在则新建文件夹
        checkDirExist(dir);
        // 重新覆盖 file.path 属性
        const fileName = getUploadFileName(ext)
        file.path = `${dir}/${fileName}`;
        file.filePath = `${staticPath}${dirName}/${fileName}`
      }
    }
  })
}

// 文件上传后返回结果
exports.uploadResult = (options, app) => {
  return async function (ctx, next) {
    const body = ctx.request.files
    body.staticPath = staticPath
    if (body.file && body.file.path) {
      // const info = path.parse(body.file.path)
      // const fileName = `${info.name}${info.ext}`
      const host = ctx.request.header.host
      // body.fileName = fileName
      // body.filePath = `${staticPath}${fileName}`
      // 文件静态资源路径
      body.fileUrl = `${host}${body.file.filePath}`
    }
    ctx.body = JSON.stringify(body);
    // console.log(ctx.request.files);
    // console.log(ctx.request.body);
  }
}
// 获取文件扩展名
function getUploadFileExt (name) {
  let ext = name.split('.');
  return ext[ext.length - 1];
}

// 根据日期生成文件夹
function getUploadDirName () {
  const date = new Date();
  let month = Number.parseInt(date.getMonth()) + 1;
  month = month.toString().length > 1 ? month : `0${month}`;
  const dir = `${date.getFullYear()}${month}${date.getDate()}`;
  return dir
}
// 获取生成的文件名
function getUploadFileName (ext) {
  const fileName = util.createFileName()
  return `${fileName}.${ext}`
}

// 检查文件夹是否存在
function checkDirExist (p) {
  const path = require('path');
  const fs = require('fs');
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}