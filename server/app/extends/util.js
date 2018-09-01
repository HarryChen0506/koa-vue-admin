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
  },
  uuid: function () { // 生产uuid
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    var uuid = s.join('')
    return uuid
  },
  createImgName: function (length = 24) {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < length; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      if (i % 5 === 4) {
        s[i] = '-'
      }
    }
    return s.join('')
  },
  createFileName: function (length = 24) {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < length; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      if (i % 5 === 4) {
        s[i] = '-'
      }
    }
    return s.join('')
  }
}
