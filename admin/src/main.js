import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'

import 'normalize.css' // A modern alternative to CSS resets
// 引入全局样式
import '@/styles/index.less'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
