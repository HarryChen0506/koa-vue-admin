// wechat 小程序服务
'use strict'
// const config = require('../config/index.js')()
const ArticleModel = require('../models/article.js')()
// const ArticleCatModel = require('../models/articleCat.js')()
// const ArticleTagModel = require('../models/articleTag.js')()
// const ArticleChapModel = require('../models/articleChap.js')()
const ArticleUserModel = require('../models/articleUser.js')()
const wlyh = {
  // 注册用户信息
  async registerUserInfo (schema = {}) {
    let {openid, ...rest} = schema
    return ArticleUserModel.findOneAndUpdate({openid}, {$set: {...rest}}, {upsert: true, new: true, projection: {openid: 1}})
  },
  // 更新用户信息
  async updateUserInfo (schema = {}) {
    let {openid, ...rest} = schema
    return ArticleUserModel.findOneAndUpdate({openid}, {$set: {...rest}}, {new: true, projection: {openid: 1, user_info: 1}})
  },
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
        } else if (v === 'title') {
          // 模糊查询
          query['title'] = {$regex: params[v]}
        } else if (v === 'writerName') {
          // 模糊查询
          query['writers.name'] = {$regex: params[v]}
        } else if (v === 'mainCategoryId') {
          // 模糊查询
          query['main_category_id'] = params[v]
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
      .populate({path: 'tag_ids', match: {delete: 0}, select: {tagname: 1}})
      .populate({path: 'main_category_id', match: {delete: 0}, select: {categoryname: 1}})
      .populate({path: 'category_ids', match: {delete: 0}, select: {categoryname: 1}})
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
    // console.log('doc', doc)
    let newUser = new ArticleModel(doc)
    return newUser.save()
  },
  async update (schema = {}) {
    let {_id, ...rest} = schema
    return ArticleModel.findOneAndUpdate({_id}, {$set: {...rest}})
  }
}

module.exports = {
  wlyh
}
