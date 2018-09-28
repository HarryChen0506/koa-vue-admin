'use strict'
// articleComment model 小程序评论模型
const mongoose = require('mongoose')
let articleCommentModel = null

module.exports = (app) => {
  const Schema = mongoose.Schema
  const ArticleCommentSchema = new Schema({
    article_id: { type: String, trim: true, required: true }, // 文章Id
    user_id: [{ type: Schema.Types.ObjectId, ref: 'ArticleUser', required: true }], // 用户ID
    user_open_id: { type: String, trim: true }, // 小程序用户唯一标识
    content: { type: String, trim: true }, // 评论内容
    voter_ids: [{ type: Schema.Types.ObjectId, ref: 'ArticleUser' }], // 点赞人
    votes_count: { type: Number, default: 0 }, // 点赞数量
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now }
  })
  ArticleCommentSchema.pre('save', function (next) {
    if (this.isNew) {
      this.create_time = this.update_time = Date.now()
    } else {
      this.update_time = Date.now()
    }
    next()
  })
  // 'articleUsers' 数据库集合名，不加的话会默认model名的复数形式
  // ArticleUser 模型名
  articleCommentModel = articleCommentModel || mongoose.model('ArticleComment', ArticleCommentSchema, 'articleComments')
  return articleCommentModel
}
