// 路由权限
'use strict'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
import router from '@/router'
import config from '@/config'

const {whiteList = []} = config()

router.beforeEach((to, from, next) => {
	NProgress.start()
  // console.log('white', whiteList)
  
  next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})