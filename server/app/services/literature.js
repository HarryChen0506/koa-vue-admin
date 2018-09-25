// literature 文学相关服务
'use strict'
// const config = require('../config/index.js')()
const ArticleModel = require('../models/article.js')()
const article = {
  async getArticleByParams (params = {}) {
    // const {username, nickname, id} = params
    let {pageSize = 10, pageNum = 1, ...rest} = params
    pageSize = parseInt(pageSize)
    pageNum = parseInt(pageNum)

    const query = {}
    Object.keys(rest).forEach(v => {
      if (params[v]) {
        if (v === 'id') {
          query['_id'] = params[v]
        } else if (v === 'username') {
          // 模糊查询
          query['username'] = {$regex: params[v]}
        } else {
          query[v] = params[v]
        }
      }
    })

    const skipNum = (pageNum - 1) * pageSize
    const sort = {'create_time': -1}

    const total = await ArticleModel.find(query).count()
    const list = await ArticleModel
      .find(query, {password: 0})
      .populate({path: 'role', match: {active: 1}, select: {rolename: 1}})
      .skip(skipNum).limit(pageSize).sort(sort)

    return {
      list,
      total
    }
  },
  async create (schema = {}) {
    let {title, ...rest} = schema
    if (!title) {
      return null
    }
    const doc = {title, ...rest}   
    console.log('doc', doc)
    let newUser = new ArticleModel(doc)
    return newUser.save()
  }
}
module.exports = {
  article
}
