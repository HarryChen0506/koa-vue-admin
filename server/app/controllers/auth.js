// auth controller
const authServive = require('../services/auth')
exports.login = async (ctx, next) => {
  // const { query, params } = ctx
  const { userName, password } = ctx.request.body
  const user = {
    userName,
    _id: 123
  }
  // const user = await ctx.service.user.login({ userName, password })
  // if (!user) {
  //   // 用户校验错误
  //   ctx.body = this.ctx.helper.setResE({
  //     success: false,
  //     detail: '用户名或密码不正确',
  //   })
  //   return
  // }
  // 生成token
  const token = await authServive.createAccessToken({
    userName,
    id: user._id
  })
  // 5b46e7acdb2ea107cff550f8
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRlc3QiLCJpZCI6IjViNDZlN2FjZGIyZWExMDdjZmY1NTBmOCIsImV4cCI6MTUzMTM3MzU3OCwic2VjcmV0Ijoic2VjcmV0IiwiaWF0IjoxNTMxMzczNTE4fQ.OSBh9DPZJi4Lp_wJ3y46GweLc_2bBCIz-dSdm7zMm5U
  // await ctx.service.user.checkAccessToken(td, 'secret')
  ctx.body = {
    success: true,
    userName: user.userName,
    id: user._id,
    accessToken: token
  }
}
