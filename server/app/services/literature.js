// literature 文学相关服务
'use strict'
// const config = require('../config/index.js')()
const ArticleModel = require('../models/article.js')()
const ArticleCatModel = require('../models/articleCat.js')()
const ArticleTagModel = require('../models/articleTag.js')()
const ArticleChapModel = require('../models/articleChap.js')()
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
  async getAllCategorys (query = {}) {
    query.delete = 0
    const sort = {'sort': 1}
    const list = await ArticleCatModel.find(query, {delete: 0}).sort(sort)
    return {
      list
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
const tag = {
  async getTagByParams (params = {}) {
    // const {username, nickname, id} = params
    let {pageSize = 10, pageNum = 1, ...rest} = params
    pageSize = parseInt(pageSize)
    pageNum = parseInt(pageNum)

    const query = {}
    Object.keys(rest).forEach(v => {
      if (params[v]) {
        if (v === 'id') {
          query['_id'] = params[v]
        } else if (v === 'tagname') {
          // 模糊查询
          query['tagname'] = {$regex: params[v]}
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
    // console.log('query', query)
    const skipNum = (pageNum - 1) * pageSize
    const sort = {'create_time': 1}

    const total = await ArticleTagModel.find(query).count()
    const list = await ArticleTagModel
      .find(query, {password: 0})
      .skip(skipNum).limit(pageSize).sort(sort)

    return {
      list,
      total
    }
  },
  async getAllTags (query = {}) {
    query.delete = 0
    const sort = {'create_time': 1}
    const list = await ArticleTagModel.find(query, {delete: 0}).sort(sort)
    return {
      list
    }
  },
  async create (schema = {}) {
    let {tagname, ...rest} = schema
    if (!tagname) {
      return null
    }
    try {
      const isExist = await ArticleTagModel.find({tagname})
      // console.log('isExist', isExist)
      if (isExist.length > 0) {
        throw new Error('该标签名已存在')
      }
    } catch (err) {
      throw err
    }
    const doc = {tagname, ...rest}
    // console.log('doc', doc)
    let newTag = new ArticleTagModel(doc)
    return newTag.save()
  },
  async update (schema = {}) {
    let {_id, ...rest} = schema
    try {
      const isExist = await ArticleTagModel.find({_id: {$ne: _id}, tagname: rest.tagname})
      // console.log('isExist', isExist)
      if (isExist.length > 0) {
        throw new Error('该标签名已存在')
      }
    } catch (err) {
      throw err
    }
    // {_id}, {$set: {...rest}}
    return ArticleTagModel.findOneAndUpdate({_id}, {$set: {...rest}}, {new: true})
  }
}
const chapter = {
  async getChapterByParams (params = {}) {
    // const {username, nickname, id} = params
    let {pageSize = 10, pageNum = 1, articleId, ...rest} = params
    pageSize = parseInt(pageSize)
    pageNum = parseInt(pageNum)

    if (!articleId) {
      throw new Error('查询参数没有articleId')
    }

    const query = {article_id: articleId}
    Object.keys(rest).forEach(v => {
      if (params[v]) {
        if (v === 'id') {
          query['_id'] = params[v]
        } else if (v === 'chaptername') {
          // 模糊查询
          query['chaptername'] = {$regex: params[v]}
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
    // console.log('query', query)
    const skipNum = (pageNum - 1) * pageSize
    const sort = {'sort': 1, 'create_time': 1}

    const total = await ArticleChapModel.find(query).count()
    const list = await ArticleChapModel
      .find(query)
      .skip(skipNum).limit(pageSize).sort(sort)

    return {
      list,
      total
    }
  },
  async create (schema = {}) {
    let {article_id, content, ...rest} = schema
    if (!article_id) {
      return null
    }
    if (!content) {
      return null
    }
    const doc = {article_id, content, ...rest}
    // console.log('doc', doc)
    let newChapter = new ArticleChapModel(doc)
    return newChapter.save()
  },
  async update (schema = {}) {
    let {_id, ...rest} = schema
    // {_id}, {$set: {...rest}}
    return ArticleChapModel.findOneAndUpdate({_id}, {$set: {...rest}}, {new: true})
  }
}
module.exports = {
  article,
  category,
  tag,
  chapter
}
