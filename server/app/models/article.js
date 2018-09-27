'use strict'
// Article model
const mongoose = require('mongoose')
let articleModel = null

module.exports = (app) => {
  const Schema = mongoose.Schema
  const ArticleSchema = new Schema({
    title: { type: String, required: true, trim: true }, // 标题
    writers: [{
      name: {type: String, trim: true}, // 作者名
      info: {type: String, trim: true} // 作者简介
    }],
    coverUrl: { type: String, trim: true }, // 封面链接
    country: { type: String, trim: true }, // 国家
    chapter_ids: [ { type: Schema.Types.ObjectId, ref: 'Chapter' } ], // 章节
    abstract: { type: String, trim: true }, // 摘要
    tag_ids: [{ type: Schema.Types.ObjectId, ref: 'ArticleTag' }], // 标签
    category_ids: [{ type: Schema.Types.ObjectId, ref: 'Category' }], // 分类
    main_category_id: { type: Schema.Types.ObjectId, ref: 'Category' }, // 主分类
    create_time: { type: Date, default: Date.now }, // 创建时间
    update_time: { type: Date, default: Date.now } // 更新时间
  })
  ArticleSchema.pre('save', function (next) {
    if (this.isNew) {
      this.create_time = this.update_time = Date.now()
    } else {
      this.update_time = Date.now()
    }
    next()
  })
  // articles 数据库集合名，不加的话会默认model名的复数形式
  // Article 模型名
  articleModel = articleModel || mongoose.model('Article', ArticleSchema, 'articles')
  return articleModel
}
