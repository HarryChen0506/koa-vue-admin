'use strict'
// Article model
const mongoose = require('mongoose')
let articleCatModel = null

module.exports = (app) => {
  const Schema = mongoose.Schema
  const ArticleCatSchema = new Schema({
    categoryname: { type: String, required: true, trim: true }, // 分类名
    sort: { type: Number }, // 排序
    count: { type: Number, default: 0 }, // 文章数量
    delete: { type: Number, min: 0, max: 1, default: 0 }, // 删除状态
    create_time: { type: Date, default: Date.now }, // 创建时间
    update_time: { type: Date, default: Date.now } // 更新时间
  })
  ArticleCatSchema.pre('save', function (next) {
    if (this.isNew) {
      this.create_time = this.update_time = Date.now()
    } else {
      this.update_time = Date.now()
    }
    next()
  })
  // articleCats 数据库集合名，不加的话会默认model名的复数形式
  // ArticleCat 模型名
  articleCatModel = articleCatModel || mongoose.model('ArticleCat', ArticleCatSchema, 'articleCats')
  return articleCatModel
}
