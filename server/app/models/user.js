'use strict'
// user model
const mongoose = require('mongoose')
let userModel = null

module.exports = (app) => {
  const Schema = mongoose.Schema
  const UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now }
  })
  UserSchema.pre('save', function (next) {
    if (this.isNew) {
      this.create_time = this.update_time = Date.now()
    } else {
      this.update_time = Date.now()
    }
    next()
  })
  // 'users' 数据库集合名，不加的话会默认model名的复数形式
  // User-模型名（可不要） user-数据库里集合名（必需）
  // Mongoose会将集合名称设置为模型名称的小写版。
  // 如果名称的最后一个字符是字母，则会变成复数；
  // 如果名称的最后一个字符是数字，则不变；
  // 如果模型名称为"MyModel"，则集合名称为"mymodels"；
  // 如果模型名称为"Model1"，则集合名称为"model1"
  userModel = userModel || mongoose.model('User', UserSchema, 'users')
  return userModel
}
