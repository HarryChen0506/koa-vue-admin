// 参数校验插件 用于controller
'use strict'

const Parameter = require('parameter')
module.exports = (options) => {
  return async function validate (ctx, next) {    
    const config = {
      // translate: function() {
      //   var args = Array.prototype.slice.call(arguments)
      //   // Assume there have I18n.t method for convert language.
      //   return I18n.t.apply(I18n, args)
      // },
      validateRoot: true // restrict the being validate value must be a object
    }
    const validator = new Parameter(config)
    ctx.app.validator = validator
    // 将validate挂载到context上
    ctx.validate = (rules, data) => {
      data = data || ctx.request.body;
      const errors = ctx.app.validator.validate(rules, data)
      if (errors) {
        ctx.throw(422, 'Validation Failed', {
          code: 'invalid_param',
          errors
        })
      }
    }
    /**
     * Validate
     *
     * ```js
     * app.validator.addRule('jsonString', (rule, value) => {
     *   try {
     *     JSON.parse(value);
     *   } catch (err) {
     *     return 'must be json string';
     *   }
     * });
     *
     * app.validator.validate({
     * 	 name: 'string',
     * 	 info: { type: 'jsonString', required: false },
     * }, {
     *   name: 'Egg',
     *   info: '{"foo": "bar"}',
     * });
     * ```
     */
    await next()
  }    
}