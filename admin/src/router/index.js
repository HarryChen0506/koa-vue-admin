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
      children: [{
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard
      },{
        path: 'about',
        name: 'about',        
        component: () => import(/* webpackChunkName: "about" */ '@/views/demo/About.vue')
      }]
    }, 
    {
      path: '/demo',
      name: 'demo',
      component: Layout,
      children: [
        {
          path: 'about',
          name: 'demo-about',
          component:  () => import(/* webpackChunkName: "about" */ '@/views/demo/About.vue')
        },
        {
          path: 'hello',
          name: 'hello',
          component:  () => import(/* webpackChunkName: "about" */ '@/views/demo/Home.vue')
        }
      ]
    }   
  ]
})
