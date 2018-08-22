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
      name: 'dashboard',
      component: Layout,
      children: [{
        path: 'dashboard',
        component: Dashboard
      }]
    },    
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
    }
  ]
})
