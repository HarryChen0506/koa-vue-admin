<template>
  <div class="app-container home">
    dashboard
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="always">
          总是显示
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          鼠标悬浮时显示
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          从不显示
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'dashboard',
  components: {
  }
}
</script>