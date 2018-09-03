// user 相关
const user = {
  state: {
    name: '',
    avatar: '',
    roles: []
  },
  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_NULL: (state) => {
      state.name = ''
      state.avatar = ''
      state.roles = []
    }
  },
  actions: {
    // 登录
    Login({commit}, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        // login(username, userInfo.password).then(response => {
        //   const data = response.data
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
        setTimeout(() => {
          commit('SET_NAME', 'hello')
          resolve()
        }, 1000)
      })
    },
    // 注销
    Logout({commit, state}) {
      return new Promise((resolve, reject) => {        
        setTimeout(() => {
          commit('SET_USER_NULL')
          resolve()
        }, 1000)
      })
    }    
  }
}

export default user
