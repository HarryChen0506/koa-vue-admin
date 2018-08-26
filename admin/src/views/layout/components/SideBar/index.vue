<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >      
      <!-- <side-bar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"/> -->
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
// import { mapGetters } from 'vuex'
// import SideBarItem from './SideBarItem'
import SidebarItem from './SidebarItem'

export default {
  components: { 
    SidebarItem 
  },
  computed: {
    // ...mapGetters([
    //   'sidebar'
    // ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      // return !this.sidebar.opened
      return false
    }
  },
  mounted () {
    // console.log('this.$router.options.routes', this.$router.options)
  }
}
</script>