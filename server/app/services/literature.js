// literature 文学相关服务
'use strict'
// const config = require('../config/index.js')()
const ArticleModel = require('../models/article.js')()
const ArticleCatModel = require('../models/articleCat.js')()
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
    // console.log('doc', doc)
    let newUser = new ArticleModel(doc)
    return newUser.save()
  },
  async update (schema = {}) {
    let {_id, ...rest} = schema
    return ArticleModel.findOneAndUpdate({_id}, {$set: {...rest}})
  }
}
const category = {
  async getCategoryByParams (params = {}) {
    // const {username, nickname, id} = params
    let {pageSize = 10, pageNum = 1, ...rest} = params
    pageSize = parseInt(pageSize)
    pageNum = parseInt(pageNum)

    const query = {}
    Object.keys(rest).forEach(v => {
      if (params[v]) {
        if (v === 'id') {
          query['_id'] = params[v]
        } else if (v === 'categoryname') {
          // 模糊查询
          query['categoryname'] = {$regex: params[v]}
        } else if (v === 'delete') {
          const code = parseInt(params[v])
          if (code === 0) {
            query['delete'] = {$in: [0, null]}
          } else {
            query['delete'] = code
          }
        } else {
          query[v] = params[v]
        }
      }
    })
    console.log('query', query)
    const skipNum = (pageNum - 1) * pageSize
    const sort = {'sort': 1, 'create_time': 1}

    const total = await ArticleCatModel.find(query).count()
    const list = await ArticleCatModel
      .find(query, {password: 0})
      .skip(skipNum).limit(pageSize).sort(sort)

    return {
      list,
      total
    }
  },
  async create (schema = {}) {
    let {categoryname, ...rest} = schema
    if (!categoryname) {
      return null
    }
    try {
      const isExist = await ArticleCatModel.find({categoryname})
      // console.log('isExist', isExist)
      if (isExist.length > 0) {
        throw new Error('该分类名已存在')
      }
    } catch (err) {
      throw err
    }
    const doc = {categoryname, ...rest}
    // console.log('doc', doc)
    let newCategory = new ArticleCatModel(doc)
    return newCategory.save()
  },
  async update (schema = {}) {
    let {_id, ...rest} = schema
    try {
      const isExist = await ArticleCatModel.find({_id: {$ne: _id}, categoryname: rest.categoryname})
      // console.log('isExist', isExist)
      if (isExist.length > 0) {
        throw new Error('该分类名已存在')
      }
    } catch (err) {
      throw err
    }
    // {_id}, {$set: {...rest}}
    return ArticleCatModel.findOneAndUpdate({_id}, {$set: {...rest}}, {new: true})
  }
}
module.exports = {
  article,
  category
}
