'use strict'
const log4js = require('log4js');
const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark']
const baseInfo = {
  // appLogLevel: 'debug',
  dir: 'logs',
  env: 'development',
  projectName: 'koa-project',
  serverIp: '0.0.0.0'
}
module.exports = (options) => {
  /**
  * options 中间件配置参数
  * options.appLogLevel: 日志级别 'debug', (暂不启用)
  * options.dir: 日志文件夹 'logs',
  * options.env: 环境 'development',
  * options.projectName: 项目名 'koa-admin',
  * options.serverIp: 服务器ip '0.0.0.0'
  */
  const opts = Object.assign({}, baseInfo, options || {})
  const {env, dir, serverIp, projectName} = opts
  const commonInfo = { projectName, serverIp }
  log4js.configure({
    appenders: {
      console: {
        type: 'console'
      },
      api: {
        type: 'DateFile', // 日志类型
        filename: `${dir}/api`, // 输出的文件名
        pattern: '-yyyy-MM-dd.log', // 文件名增加后缀
        alwaysIncludePattern: true, // 是否总是有后缀名
        layout: {type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m'}
      },
      db: {
        type: 'DateFile',
        filename: `${dir}/db`,
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        layout: {type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m'}
      }
    },
    categories: {
      default: {
        appenders: ['api'],
        level: 'info'
      },
      api: {
        appenders: env === 'development' ? ['console', 'api'] : ['api'],
        level: 'trace'
      },
      db: {
        appenders: env === 'development' ? ['console', 'db'] : ['db'],
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
    logger.info(access(ctx, `responseTime ${responseTime}ms`, commonInfo))
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
