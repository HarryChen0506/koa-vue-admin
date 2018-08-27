import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout'
import Dashboard from '@/views/dashboard'

Vue.use(Router)

export default new Router({
  mode: 'history',  
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'index',
      component: Layout,
      meta: {title: '首页', icon: 'el-icon-menu'},
      children: [{
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {title: '面板', icon: 'el-icon-star-on'},
      },{
        path: 'about',
        name: 'about',  
        meta: {title: '关于', icon: 'el-icon-star-on'},              
        component: () => import(/* webpackChunkName: "about" */ '@/views/demo/About.vue')
      }]
    }, 
    {
      path: '/demo',
      name: 'demo',
      component: Layout,
      meta: {title: '案例', icon: 'el-icon-menu'},
      children: [
        {
          path: 'about',
          name: 'demo-about',
          meta: {title: '新关于', icon: 'el-icon-star-on'},
          component:  () => import(/* webpackChunkName: "about" */ '@/views/demo/About.vue')
        },
        {
          path: 'hello',
          name: 'hello',
          meta: {title: '你好', icon: 'el-icon-star-on'},
          component:  () => import(/* webpackChunkName: "about" */ '@/views/demo/Home.vue')
        }
      ]
    }   
  ]
})
