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
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import AppMain from './components/AppMain'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data () {
    return {
      sidebar: {
        opened: true,
        withoutAnimation: false
      }
    }
  },
  computed: {    
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  },
  methods: {
    
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
