// 业务请求服务
import http from './http'
import util from '@/utils/util'
const user = {
	info: function (option = {}) {			
		const path = '/proxy/api/users/:id'
		const url = util.formatUrl(path, option)
		return http.httpGet(url)
	},
	login: function (option = {}, data) {		
		const path = '/proxy/api/auth/login'
		const url = util.formatUrl(path, option)		
		return http.httpPost(url, data)
	}
}

export default  {    
  user
}