'use strict'
import * as axios from 'axios'
// import util from './util'

const instance = axios.create()
// 请求拦截 可添加header
instance.interceptors.request.use(config => {
	//   let user = util.cookie.get('versaEnergizeUser')
	//   if (!user) {
	//     window.location.href = '/login'
	//   } else {
	//     config.headers['X-Token'] = user
	//     return config
	//   }
  return config
}, error => {
	console.log(error)
	return Promise.reject(error)
})

// instance.interceptors.response.use(data => {
//   return data
//  }, error => {
//   return Promise.reject(error)
//  })

export default instance
