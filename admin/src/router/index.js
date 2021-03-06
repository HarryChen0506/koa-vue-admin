import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Dashboard from '@/views/dashboard'
import Upload from '@/views/upload'
import Richtext from '@/views/richtext'


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
      path: '/login',
      name: 'login',
      component: Login,
      meta: {title: '登录', icon: 'el-icon-menu'},
      hidden: true
    },
    {
      path: '/demo',
      name: 'demo',
      component: Layout,
      meta: {title: '案例', icon: 'icon-suitcase'},
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
    },
    {
      path: '/tool',
      name: 'tool',
      component: Layout,
      meta: {title: '工具', icon: 'icon-wrench'},
      children: [
        {
          path: 'upload',
          name: 'upload',
          meta: {title: '上传', icon: 'icon-cloud-upload'},
          component: Upload
        }, {
          path: 'richtext',
          name: 'richtext',
          meta: {title: '富文本', icon: 'icon-underline'},
          component: Richtext
        }
      ]
    }
  ]
})
