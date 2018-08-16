// user controller
exports.index = async (ctx, next) => {
  ctx.body = 'this is a user response!!!'
}
exports.show = async (ctx, next) => {
  console.log('params', ctx.params)
  ctx.body = 'this is a user response---'
}