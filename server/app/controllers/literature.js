// user controller
// const config = require('../config/index.js')()
const util = require('../extends/util')
const literatureService = require('../services/literature')

// 文章管理
const article = {
  async list (ctx, next) {
    const {query} = ctx
    // console.log('query', query)
    try {
      const result = await literatureService.article.getArticleByParams(query)
      result.list = result.list.map(v => {
        return util.formatObjectKeyFromlineToCamel(v._doc)
      })
      ctx.dblog.info('article: article query success')
      ctx.body = util.handleResult('success', result)
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
    // 字段转换
    const schema = {title}
    Object.keys(rest).forEach(v => {
      if (rest[v]) {
        switch (v) {
        case 'tagIds':
          schema['tag_ids'] = rest[v]
          break
        case 'categoryIds':
          schema['category_ids'] = rest[v]
          break
        case 'mainCategoryId':
          schema['main_category_id'] = rest[v]
          break
        default:
          schema[v] = rest[v]
        }
      }
    })
    // console.log('schema', schema)
    try {
      const result = await literatureService.article.create(schema)
      // console.log('result', result, result._doc)
      // const {...article} = result._doc
      const article = util.formatObjectKeyFromlineToCamel(result._doc)
      ctx.body = util.handleResult('success', article)
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err.message || '创建文章失败')
    }
  },
  async put (ctx, next) {
    const {request} = ctx
    const {id, ...rest} = request.body
    try {
      ctx.validate({
        id: 'string'
      }, {id})
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err)
      return
    }
    // 字段转换
    const schema = {_id: id, ...rest}
    Object.keys(rest).forEach(v => {
      if (rest[v]) {
        switch (v) {
        case 'tagIds':
          schema['tag_ids'] = rest[v]
          break
        case 'categoryIds':
          schema['category_ids'] = rest[v]
          break
        case 'mainCategoryId':
          schema['main_category_id'] = rest[v]
          break
        default:
          schema[v] = rest[v]
        }
      }
    })
    try {
      const result = await literatureService.article.update(schema)
      if (result) {
        ctx.body = util.handleResult('success', result)
      } else {
        ctx.body = util.handleResult('fail', null, '更新角色失败')
      }
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err.message || '更新角色失败')
    }
  }
}

const category = {
  async list (ctx, next) {
    const {query} = ctx
    // console.log('query', query)
    try {
      const result = await literatureService.category.getCategoryByParams(query)
      result.list = result.list.map(v => {
        return util.formatObjectKeyFromlineToCamel(v._doc)
      })
      ctx.dblog.info('literature: category query success')
      ctx.body = util.handleResult('success', result)
    } catch (err) {
      ctx.dblog.info('literature: category is not exist')
      console.log('err', err)
      // 用户校验错误
      ctx.body = util.handleResult('fail', null, err || '文章分类不存在')
    }
  },
  async post (ctx, next) {
    const {request} = ctx
    const {categoryname, ...rest} = request.body
    try {
      ctx.validate({
        categoryname: 'string'
      }, {categoryname})
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err)
      return
    }
    // 字段转换
    const schema = {categoryname, ...rest}
    try {
      const result = await literatureService.category.create(schema)
      // console.log('result', result, result._doc)
      // const {...article} = result._doc
      const category = util.formatObjectKeyFromlineToCamel(result._doc)
      ctx.body = util.handleResult('success', category)
    } catch (err) {
      // console.log('err', err.message)
      ctx.body = util.handleResult('fail', null, err.message || '创建分类失败')
    }
  },
  async put (ctx, next) {
    const {request} = ctx
    const {id, ...rest} = request.body
    try {
      ctx.validate({
        id: 'string'
      }, {id})
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err)
      return
    }
    // 字段转换
    const schema = {_id: id, ...rest}
    try {
      const result = await literatureService.category.update(schema)
      if (result) {
        ctx.body = util.handleResult('success', result)
      } else {
        ctx.body = util.handleResult('fail', null, '更新分类失败')
      }
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err.message || '更新分类失败')
    }
  }
}

const tag = {
  async list (ctx, next) {
    const {query} = ctx
    // console.log('query', query)
    try {
      const result = await literatureService.tag.getTagByParams(query)
      result.list = result.list.map(v => {
        return util.formatObjectKeyFromlineToCamel(v._doc)
      })
      ctx.dblog.info('literature: tag query success')
      ctx.body = util.handleResult('success', result)
    } catch (err) {
      ctx.dblog.info('literature: tag is not exist')
      console.log('err', err)
      // 用户校验错误
      ctx.body = util.handleResult('fail', null, err || '文章标签不存在')
    }
  },
  async all (ctx, next) {
    const {query} = ctx
    // console.log('query', query)
    try {
      const result = await literatureService.tag.getAllTags(query)
      result.list = result.list.map(v => {
        return util.formatObjectKeyFromlineToCamel(v._doc)
      })
      ctx.dblog.info('literature: tag all query success')
      ctx.body = util.handleResult('success', result)
    } catch (err) {
      ctx.dblog.info('literature: tag all is not exist')
      console.log('err', err)
      // 用户校验错误
      ctx.body = util.handleResult('fail', null, err || '文章标签不存在')
    }
  },
  async post (ctx, next) {
    const {request} = ctx
    const {tagname, ...rest} = request.body
    try {
      ctx.validate({
        tagname: 'string'
      }, {tagname})
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err)
      return
    }
    // 字段转换
    const schema = {tagname}
    Object.keys(rest).forEach(v => {
      if (rest[v]) {
        switch (v) {
        case 'tagParentId':
          schema['tag_parent_id'] = rest[v]
          break
        default:
          schema[v] = rest[v]
        }
      }
    })
    try {
      const result = await literatureService.tag.create(schema)
      // console.log('result', result, result._doc)
      // const {...article} = result._doc
      const tag = util.formatObjectKeyFromlineToCamel(result._doc)
      ctx.body = util.handleResult('success', tag)
    } catch (err) {
      // console.log('err', err.message)
      ctx.body = util.handleResult('fail', null, err.message || '创建分类失败')
    }
  }
}

// 章节管理
const chapter = {
}

module.exports = {
  article,
  category,
  tag,
  chapter
}
