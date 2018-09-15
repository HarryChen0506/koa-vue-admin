<template>
  <div class="app-container home">
    
    <el-button type="primary" @click="upload">
        接口测试<i class="el-icon-upload el-icon--right"></i>
    </el-button>
    <el-button type="primary" @click="ossSign">
        oss sign<i class="el-icon-upload el-icon--right"></i>
    </el-button>
    <div style="margin-top: 20px">
      上传图片
      <image-upload fileLoadId="image_upload_1" @output-image="getImage"></image-upload>
      <div style="margin-top: 10px">
        <img width=200 v-if="imageUrl" :src="imageUrl" alt="">
      </div>      
    </div>
    <!-- <div>
      上传文件      
      <input id="file" type="file" name="file" value="" multiple="multiple" />          
      <button @click="uploadFile">提交</button>
    </div> -->
    <div style="margin-top: 20px">
      上传文件
      <file-upload fileLoadId="file_upload_1" @output-file="getFile"></file-upload>
    </div>
    <div style="margin-top: 20px">
      oss上传
      <input class="" ref="fileLoadId" type="file" id="fileLoadId" name="fileLoadId" @change="ossUpload">
    </div>

  </div>  
</template>

<script>
// @ is an alias to /src
// import axios from '@/services/axios'
import axios from 'axios'
// import util from '@/services/util'
import request from '@/services/request'
import ImageUpload from '@/components/ImageUpload'
import FileUpload from '@/components/FileUpload'

export default {
  name: 'upload',
  components: {
    ImageUpload,
    FileUpload
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
    ossSign () {
      let path = '/proxy/api/upload/ossSign'
      axios.post(path)
      .then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      })
    },
    ossUpload () {
      const file = this.$refs['fileLoadId'].files[0]
      console.log('file', file)
      axios.post(`/proxy/api/upload/ossSign`)
        .then((res) => {
          console.log('res', res)
          const params = res.data.result
          var formData = new FormData()
          // var params = res.data.params
          for (var key in params) {
            formData.append(key, params[key])
          }
          // params.key = res.data.prefix + filename + suffix
          formData.append('file', file)

          axios({
            method: 'post',
            url: params.host,
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: formData
          }).then((data) => {
            console.log('data', data)
          })

        })


    },
    getImage (data) {
      // console.log('data', data)
      this.imageUrl = data.pictureUrl
    },
    uploadFile () {
      console.log('upload file')
      var files = document.getElementById("file").files;
      console.log('files', files)
      var formData=new FormData();
      formData.append('file',files[0]);
      
      let url = '/proxy/api/upload/file'
      axios({
          method: 'post',
          url: url,
          headers: {
              'Content-Type': 'multipart/form-data'
          },
          data: formData
      }).then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    getFile (data) {
      console.log('data', data)
    }
  }
}
</script>