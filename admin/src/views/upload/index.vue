<template>
  <div class="app-container home">
    
    <el-button type="primary" @click="upload">
        接口测试<i class="el-icon-upload el-icon--right"></i>
    </el-button>
    <div style="margin-top: 20px">
      上传
      <image-upload fileLoadId="image_upload_1" @output-image="getImage"></image-upload>
      <div style="">
        <img width=200 v-if="imageUrl" :src="imageUrl" alt="">
      </div>      
    </div>
  </div>  
</template>

<script>
// @ is an alias to /src
// import axios from '@/services/axios'
// import util from '@/services/util'
import request from '@/services/request'
import ImageUpload from '@/components/ImageUpload'

export default {
  name: 'upload',
  components: {
    ImageUpload
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  methods: {
    upload () {       
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
    },
    getImage (data) {
      console.log('data', data)
      this.imageUrl = data.pictureUrl
    }
  }
}
</script>