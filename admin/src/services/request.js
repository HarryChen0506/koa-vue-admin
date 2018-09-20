// 业务请求服务
import http from './http'
import util from '@/utils/util'
const user = {
	info: function (option = {}) {			
		const path = '/proxy/api/users/demo/show'
		const url = util.formatUrl(path, option)
		return http.httpGet(url)
	},
	login: function (option = {}, data) {		
		const path = '/proxy/api/auth/login'
		const url = util.formatUrl(path, option)		
		return http.httpPost(url, data)
	},
	getUserById: function (id) {	
		const url = `/proxy/api/users/${id}`
		return http.httpGet(url)
	},
	getUserByParams: function (option = {}) {
		const path = '/proxy/api/users'
		const url = util.formatUrl(path, option)	
		return http.httpGet(url)
	},
	createUser: function (data) {
		const path = '/proxy/api/users'
		return http.httpPost(path, data)
	},
	updateUser: function (data) {
		const path = '/proxy/api/users'
		return http.httpPut(path, data)
	}
}
const role = {
	getRoleByParams: function (option = {}) {			
		const path = '/proxy/api/role'
		const url = util.formatUrl(path, option)
		return http.httpGet(url)
	},
	getAllRoles: function (option = {}) {
		const path = '/proxy/api/role/all'
		const url = util.formatUrl(path, option)
		return http.httpGet(url)
	},
	createRole: function (data) {
		const path = '/proxy/api/role'
		return http.httpPost(path, data)
	},
	updateRole: function (data) {
		const path = '/proxy/api/role'
		return http.httpPut(path, data)
	}
}

export default  {    
	user,
	role
}