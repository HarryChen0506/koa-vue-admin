// user controller
// const config = require('../config/index.js')()
const util = require('../extends/util')
const literatureService = require('../services/literature')

// 文章管理
const article = {
  async list (ctx, next) {
    const {query} = ctx
    console.log('query', query)
    try {
      const list = await literatureService.article.getArticleByParams(query)
      ctx.dblog.info('article: article query success')
      ctx.body = util.handleResult('success', list)
    } catch (err) {
      ctx.dblog.info('article: article is not exist')
      // 用户校验错误
      ctx.body = util.handleResult('fail', null, err || '文章不存在')
    }
  },
  async post (ctx, next) {
    const {request} = ctx
    const {title, ...rest} = request.body
    try {
      ctx.validate({
        title: 'string'
      }, {title})
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err)
      return
    }
    try {
      const result = await literatureService.article.create({title, ...rest})
      const {...article} = result._doc
      ctx.body = util.handleResult('success', article)
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err.message || '创建文章失败')
    }
  }
}

// 章节管理
const chapter = {

}

module.exports = {
  article,
  chapter
}
