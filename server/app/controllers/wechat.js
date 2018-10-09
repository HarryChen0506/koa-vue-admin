// wechat controller
const axios = require('axios')
// const config = require('../config/index.js')()
const util = require('../extends/util')
const literatureService = require('../services/literature')
const wechatService = require('../services/wechat')

// 围炉夜话小程序
const wlyh = {
  async demo (ctx, next) {
    const {query} = ctx
    ctx.body = {query}
  },
  async logincode (ctx, next) {
    const {request} = ctx
    const {code, appId, appSecret} = request.body
    try {
      ctx.validate({
        code: 'string'
      }, {code})
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err)
      return
    }
    try {
      let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
      const result = await axios({method: 'GET', url: url})
      const {openid, session_key} = result.data
      const schema = {
        openid,
        session_key
      }
      const user = await wechatService.wlyh.registerUserInfo(schema)
      // const article = util.formatObjectKeyFromlineToCamel(result._doc)
      ctx.body = util.handleResult('success', user)
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err.message || '获取openId失败')
    }
  },
  async updateUserInfo (ctx, next) {
    const {request} = ctx
    const {openId, appId, userInfo, encryptedData, iv, rawData, signature} = request.body
    try {
      const schema = {
        openid: openId,
        appid: appId,
        user_info: userInfo,
        encrypted_data: encryptedData,
        raw_data: rawData,
        iv,
        signature
      }
      const result = await wechatService.wlyh.updateUserInfo(schema)
      const user = util.formatObjectKeyFromlineToCamel(result._doc)
      ctx.body = util.handleResult('success', user)
    } catch (err) {
      ctx.body = util.handleResult('fail', null, err.message || '更新用户信息失败')
    }
  }
}

module.exports = {
  wlyh
}
