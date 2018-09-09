// user 相关
import request from '@/services/request'
import axios from '@/services/axios'

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
    Login ({commit}, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise(async (resolve, reject) => {
        try {
          const result = await request.user.login({}, userInfo) 
          const {data} = result
          if (data.success) {
            resolve()  
          } else {
            reject(data.message)
          }   
        } catch (err) {
          // console.log('reject', err)
          reject(err)
        }
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
