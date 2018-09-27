'use strict'
// ArticleChapter model 章节
const mongoose = require('mongoose')
let articleChapModel = null

module.exports = (app) => {
  const Schema = mongoose.Schema
  const ArticleChapSchema = new Schema({
    chaptername: { type: String, trim: true }, // 章节名
    content: { type: String, required: true, trim: true }, // 内容
    article_id: { type: Schema.Types.ObjectId, required: true, ref: 'Article' }, // 文章id
    sort: { type: Number }, // 排序
    delete: { type: Number, min: 0, max: 1, default: 0 }, // 删除状态
    create_time: { type: Date, default: Date.now }, // 创建时间
    update_time: { type: Date, default: Date.now } // 更新时间
  })
  ArticleChapSchema.pre('save', function (next) {
    if (this.isNew) {
      this.create_time = this.update_time = Date.now()
    } else {
      this.update_time = Date.now()
    }
    next()
  })
  // articleChaps 数据库集合名，不加的话会默认model名的复数形式
  // ArticleChap 模型名
  articleChapModel = articleChapModel || mongoose.model('ArticleChap', ArticleChapSchema, 'articleChaps')
  return articleChapModel
}
