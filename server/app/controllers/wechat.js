// wechat controller
// const config = require('../config/index.js')()
const util = require('../extends/util')
const literatureService = require('../services/literature')

// 围炉夜话小程序
const wlyh = {
  async demo (ctx, next) {
    const {query} = ctx
    ctx.body = {query}
  },
  async logincode (ctx, next) {
    const {request} = ctx
    const {code, ...rest} = request.body
    try {
      ctx.validate({
        code: 'string'
      }, {code})
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err)
      return
    }

    ctx.body = util.handleResult('success', {code})

    // try {
    //   const result = await literatureService.article.create(schema)
    //   // console.log('result', result, result._doc)
    //   // const {...article} = result._doc
    //   const article = util.formatObjectKeyFromlineToCamel(result._doc)
    //   ctx.body = util.handleResult('success', article)
    // } catch (err) {
    //   ctx.body = util.handleResult('fail', null, err.message || '创建文章失败')
    // }
  }
}

module.exports = {
  wlyh
}
