'use strict'
// ArticleTag model
const mongoose = require('mongoose')
let articleTagModel = null

module.exports = (app) => {
  const Schema = mongoose.Schema
  const ArticleTagSchema = new Schema({
    tagname: { type: String, required: true, trim: true }, // 标签名
    tag_parent_id: { type: Schema.Types.ObjectId }, // 父标签
    delete: { type: Number, min: 0, max: 1, default: 0 }, // 删除状态
    create_time: { type: Date, default: Date.now }, // 创建时间
    update_time: { type: Date, default: Date.now } // 更新时间
  })
  ArticleTagSchema.pre('save', function (next) {
    if (this.isNew) {
      this.create_time = this.update_time = Date.now()
    } else {
      this.update_time = Date.now()
    }
    next()
  })
  // articleTags 数据库集合名，不加的话会默认model名的复数形式
  // ArticleTag 模型名
  articleTagModel = articleTagModel || mongoose.model('ArticleTag', ArticleTagSchema, 'articleTags')
  return articleTagModel
}
