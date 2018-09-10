'use strict'
import * as axios from 'axios'
import util from '@/utils/util'
import config from '@/config'
const {accessKey = 'accessToken'} = config()


const instance = axios.create()
// 请求拦截 可添加header
instance.interceptors.request.use(config => {
	const token = util.LocalStorage.get(accessKey)
	if (token) {
		const {payload = {}} = util.parseToken(token)
		const key = payload.key || 'access_token'
		config.headers[key] = token
	}
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
