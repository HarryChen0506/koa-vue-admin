<template>
  <div :class="classObj" class="app-wrapper">    
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
// import { Navbar, Sidebar, AppMain } from './components'
import config from '@/config'
import util from '@/utils/util'
import request from '@/services/request'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import AppMain from './components/AppMain'
const {accessKey = 'accessToken'} = config()

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data () {
    return {     
    }
  },
  computed: {    
    sidebar() {
      return this.$store.state.app.sidebar
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  },
  mounted() {
    console.log('layout mounted')
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      const token = util.LocalStorage.get(accessKey)
      if (token) {
        const {payload = {}} = util.parseToken(token)
        const id = payload.id
        request.user.getUserById(id).then(res => {
          if (res.data.success) {
            const {username} = res.data.result
            this.$store.commit('SET_NAME', username)
          }          
        })
      } else {
        console.log('123')
      }      
    }
  }
}
</script>

<style lang="less" scoped>
  // @import "src/styles/mixin.scss";
  .app-wrapper {
    // @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;   
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
