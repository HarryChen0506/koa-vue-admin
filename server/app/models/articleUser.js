'use strict'
// articleUser model 小程序用户模型
const mongoose = require('mongoose')
let articleUserModel = null

module.exports = (app) => {
  const Schema = mongoose.Schema
  const ArticleUserSchema = new Schema({
    openid: { type: String, required: true, trim: true }, // 用户唯一标识
    unionid: { type: String, trim: true }, // 用户在开放平台的唯一标识符
    session_key: { type: String, trim: true }, // 会话密钥
    appid: { type: String, trim: true }, // 小程序id
    signature: { type: String, trim: true }, // 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，详见 用户数据的签名验证和加解密
    encrypted_data: { type: String, trim: true }, // 包括敏感数据在内的完整用户信息的加密数据，详见 用户数据的签名验证和加解密
    iv: { type: String, trim: true }, // 加密算法的初始向量，详见 用户数据的签名验证和加解密
    raw_data: { type: String, trim: true }, // 不包括敏感信息的原始数据字符串，用于计算签名
    user_info: {
      nickName: { type: String, trim: true }, // 昵称
      avatarUrl: { type: String, trim: true }, // 头像
      gender: { type: Number }, // 性别  0：未知、1：男、2：女
      language: { type: String, trim: true }, // 语言 "zh_CN" "en" "zh_TW"
      country: { type: String, trim: true }, // 国家
      province: { type: String, trim: true }, // 省份
      city: { type: String, trim: true } // 城市
    },
    login: { type: Number, default: 0 }, // 登录状态 0 未登录 1 登录
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now }
  })
  ArticleUserSchema.pre('save', function (next) {
    if (this.isNew) {
      this.create_time = this.update_time = Date.now()
    } else {
      this.update_time = Date.now()
    }
    next()
  })
  // 'articleUsers' 数据库集合名，不加的话会默认model名的复数形式
  // ArticleUser 模型名
  articleUserModel = articleUserModel || mongoose.model('ArticleUser', ArticleUserSchema, 'articleUsers')
  return articleUserModel
}
