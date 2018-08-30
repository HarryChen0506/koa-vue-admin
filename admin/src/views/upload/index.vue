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
// import axios from '@/services/axios'
// import util from '@/services/util'
import request from '@/services/request'

export default {
  name: 'upload',
  components: {
  },
  methods: {
    upload() {       
      // let path = '/proxy/api/users/:id'
      // let url = util.formatUrl(path, {
      //   query: {
      //     key: 123,
      //     name: ['hello', 'good']
      //   },
      //   params: {
      //     id: '1234'
      //   }
      // })
      // console.log('upload', url)
			// axios.get(url)
      // .then(function (response) {
      //   console.log(response);
      // })
      // .catch(function (error) {
      //   console.log(error);
      // })
      console.log('request', request)
      const option = {
        query: {
          key: 123,
          name: ['hello', 'good']
        },
        params: {
          id: '1234'
        }
      }
      request.user.info(option).then(res => {
        console.log('res', res)
      })
    }
  }
}
</script>