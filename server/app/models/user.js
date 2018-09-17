'use strict'
// user model
const mongoose = require('mongoose')
let userModel = null

module.exports = (app) => {
  const Schema = mongoose.Schema
  const UserSchema = new Schema({
    username: { type: String, required: true, trim: true },
    password: { type: String, trim: true },
    avatar: { type: String, trim: true },
    active: { type: Number, min: 0, max: 1, default: 1 }, // 激活状态
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

// 案例
// var schema3 = new Schema({
//   test: {
//     type: String,
//     lowercase: true, // 总是将test的值转化为小写
//     uppercase: true, // 总是将test的值转化为大写
//     required:true, //设定是否必填
//     default:'star', //设定默认值
//     index：true, //设定索引值
//     unique：true, //索引值唯一
//     sparse：true, //是否启用稀疏索引
//     match：RegExp, //判断是否通过正则验证
//     enum：Array， //判断test值是否包含于enmu对应的数组中
//     min：Number， //判断对应值是否大于等于给定值
//     max：Number， //判断对应值是否小于等于给定值
//     trim:true //去除数据前后的空格
//     capped:1024 //限定大小最大为1024字节
//     validate：function，为此属性添加一个验证器函数，如demo1所示
//     get：function，//为这个属性定义一个定制的getter Object.defineProperty()。如demo2所示
//     set：function，//定义此属性的自定义设置Object.defineProperty()。如demo2所示
//   }
// });
