// 路由权限
'use strict'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
import router from '@/router'
import util from '@/utils/util'
import config from '@/config'
const {accessKey = 'accessToken'} = config()
const {whiteList = []} = config()
const token = util.LocalStorage.get(accessKey)

router.beforeEach((to, from, next) => {
	NProgress.start()
  // console.log('white', whiteList)
  if (token) {
    // token生成
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() 
    } else {
     next()
    }
  } else {
    // 未生成token
    if (whiteList.indexOf(to.path) !== -1) {
      // console.log('白名单')
      next()
    } else  {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
  next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})