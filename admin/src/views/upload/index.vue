<template>
  <div class="app-container home">
    upload
    <el-button type="primary" @click="upload">
        上传<i class="el-icon-upload el-icon--right"></i>
    </el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'

export default {
  name: 'upload',
  components: {
  },
  methods: {
    upload() {
			console.log('upload') 
			axios.get('/proxy/api/users/123')
				.then(function (response) {
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
				})
    }
  }
}
</script>