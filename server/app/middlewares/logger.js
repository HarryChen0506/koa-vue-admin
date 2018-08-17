'use strict'
const log4js = require('log4js');
const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark']
module.exports = (options) => {
  /**
 * 指定要记录的日志分类 web
 * 展示方式为文件类型 file
 * 日志输出的文件名 cheese.log
 */
  log4js.configure({
    appenders: {
      console:{
        type: 'console'
      },  
      web: {
        type: 'dateFile', // 日志类型
        filename: 'logs/web', // 输出的文件名
        pattern: '-yyyy-MM-dd.log', // 文件名增加后缀
        alwaysIncludePattern: true // 是否总是有后缀名
      },
      api: {
        type: 'DateFile',
        filename: 'logs/api',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        layout:{type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m'}
      },
      db: {
        type: 'DateFile',
        filename: 'logs/db',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        layout:{type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m'}
      }    
    },
    categories: { 
      default: { 
        appenders: ['web'], 
        level: 'info' 
      },
      api:{
        appenders: ['console', 'api'],
        level: 'trace'
      },
      db:{
        appenders: ['console', 'db'],
        level: 'info'
      }  
    }
  })
  
  // api logger
  const logger = log4js.getLogger('api')  
  const contextLogger = {}
  // 数据库logger
  const logger_db = log4js.getLogger('db')
  const contextLogger_db = {}
  // 循环methods将所有方法挂载到ctx 上
  methods.forEach((method, i) => {
    contextLogger[method] = (message) => {
      logger[method](message)
    }
    contextLogger_db[method] = (message) => {
      logger_db[method](message)
    }
  })
 
  return async (ctx, next) => {
    const start = Date.now()
    // 将contextLogger挂在到context上
    ctx.log = contextLogger
    ctx.dblog = contextLogger_db
    try {
      await next()
    } catch (err) {
      if (ctx.status < 500) {
        ctx.status = 500
      }
      ctx.log.error(err.stack)
      ctx.state.logged = true
      ctx.throw(err)
    }
    const end = Date.now()
    const responseTime = end - start;
    logger.info(access(ctx, `响应时间${responseTime}ms`, {}))
  }
}

function access (ctx, message, commonInfo) {
  const {
    method, // 请求方法 get post或其他
    url, // 请求链接
    host, // 发送请求的客户端的host
    headers // 请求中的headers
  } = ctx.request;
  const client = {
    method,
    url,
    host,
    message,
    referer: headers['referer'], // 请求的源地址
    userAgent: headers['user-agent'] // 客户端信息 设备及浏览器信息
  }
  return JSON.stringify(Object.assign(commonInfo, client));
}
