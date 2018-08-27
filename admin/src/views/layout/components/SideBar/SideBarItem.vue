<template>
  <div class="menu-wrapper">

    <router-link v-if="!item.children" :to="item.path">
      <el-menu-item :index="resolvePath(item.path)"> 
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </router-link>   
    
    <el-submenu v-else :index="resolvePath(item.path)">
      <template slot="title">
        <i :class="item.meta && item.meta.icon"></i>
        <span slot="title">{{item.name}}</span>
      </template>
       <template v-for="child in item.children">
        <sidebar-item
          v-if="child.children&&child.children.length>0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"/>
        <router-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)">
            <i :class="child.meta && child.meta.icon"></i>
            <span slot="title">{{ child.name }}</span>
          </el-menu-item>
        </router-link>
      </template>             
    </el-submenu>
    

    <!-- <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">导航一</span>
      </template>
      <el-submenu index="1-4">
        <span slot="title">选项4</span>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>        
    </el-submenu>
    <router-link to="/about">
      <el-menu-item index="2"> 
        <i class="el-icon-menu"></i>
        <span slot="title">about</span>
      </el-menu-item>
    </router-link>
    <el-menu-item index="3" disabled>
      <i class="el-icon-document"></i>
      <span slot="title">导航三</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <span slot="title">导航四</span>
    </el-menu-item> -->
  </div>
</template>

<script>
import path from 'path'

export default {
  name: 'SidebarItem',
  props: {
    // route配置json
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  mounted () {
    // console.log('item', this.item)
  },
  methods: {
    hasOneShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    resolvePath(...paths) {
      return path.resolve(this.basePath, ...paths)
    }
  }
}
</script>
