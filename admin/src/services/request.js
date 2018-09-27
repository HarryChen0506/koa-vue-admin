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
const literature = {
	article: {
		getArticleByParams: function (option = {}) {			
			const path = '/proxy/api/literature/article/list'
			const url = util.formatUrl(path, option)
			return http.httpGet(url)
		},
		createArticle: function (data) {
			const path = '/proxy/api/literature/article'
			return http.httpPost(path, data)
		},
		updateArticle: function (data) {
			const path = '/proxy/api/literature/article'
			return http.httpPut(path, data)
		}
	},
	category: {
		getCategoryByParams: function (option = {}) {			
			const path = '/proxy/api/literature/category/list'
			const url = util.formatUrl(path, option)
			return http.httpGet(url)
		},
		getAllCategorys: function (option = {}) {
			const path = '/proxy/api/literature/category/all'
			const url = util.formatUrl(path, option)
			return http.httpGet(url)
		},		
		createCategory: function (data) {
			const path = '/proxy/api/literature/category'
			return http.httpPost(path, data)
		},
		updateCategory: function (data) {
			const path = '/proxy/api/literature/category'
			return http.httpPut(path, data)
		}
	},
	tag: {
		getAllTags: function (option = {}) {
			const path = '/proxy/api/literature/tag/all'
			const url = util.formatUrl(path, option)
			return http.httpGet(url)
		},
		createTag:  function (data) {
			const path = '/proxy/api/literature/tag'
			return http.httpPost(path, data)
		},
		updateTag: function (data) {
			const path = '/proxy/api/literature/tag'
			return http.httpPut(path, data)
		}
	}
}

export default  {    
	user,
	role,
	literature
}