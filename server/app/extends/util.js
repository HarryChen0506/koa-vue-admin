// 工具函数
'use strict'

module.exports = {
  handleResult (type, result, message) {
    switch (type) {
    case 'success':
      return {
        success: true,
        result,
        message: message || 'success'
      }
    case 'fail':
      return {
        success: false,
        result,
        message: message || 'fail'
      }
    default:
      return {
        success: true,
        result,
        message
      }
    }
  }
}
