<template>
  <div class="image-upload-container">    
    <input class="input hidden" :ref="componentId" type="file" :id="fileLoadId" :name="fileLoadId" @change="upload()">
    <el-button class="button" type="primary" size="mini">
      <label :for="fileLoadId">
        上传<i class="el-icon-upload el-icon--right"></i>
      </label>
    </el-button>
    <!-- <el-button type="primary" size="mini" @click="dispatch">
        发给父组件
    </el-button> -->
  </div>
</template>

<style lang="less"  scoped>
  .image-upload-container {
    display: inline-block;
    position: relative;
    .input {
      position: absolute;
      width: 100%;
      height: 100%;
      background: red;      
    }
    .button {
    }
  }  
  .hidden {
    /* display: none */
    opacity: 0;
  }	
  .image-upload-container  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    text-align: right;
  } 
</style>

<script>
  // 图片上传组件
  import axios from '@/services/axios'
  import util from '@/utils/util'
  // import {convertBase64UrlToBlob} from '~/plugins/compressImg'
  export default {
    name: 'imageUpload',
    props: ['config', 'fileLoadId', 'oss'],
    data () {
      return {
        componentId: this.fileLoadId || Date.now(),
        isOss: this.oss === undefined ? true : (!!this.oss), // mode 上传模式 默认阿里oss 否则上传到服务器
        model: {          
          config: this.config || {},
          pictureUrl: ''
        }
      }
    },
    mounted () { 
    },
    methods: {
      dispatch () {
        console.log('通知父组件', this.$refs)
        this.$emit('output-image', this.model)
      },
      upload () {
        if (!this.isOss) {
          this.uploadByServer()
        } else {
          this.uploadByOss()
        }
      },
      uploadByServer () {
        // 上传到服务器模式
        const file = this.$refs[this.componentId].files[0]
        if (file.type.split('/')[0] !== 'image') {
          return
        }        
        const reader = new FileReader()
        reader.onload = () => {
          // console.log('reader.result', reader.result)          
          axios.post('/proxy/api/upload/image', {
            data: reader.result
          }).then(res => {
            // console.log('res', res)
            // const host = res.data.result.host
            // const filePath = res.data.result.filePath
            this.model.pictureUrl = res.data.result.url
            this.dispatch()
            // 将input重新取值，解决相同文件change失效
            this.$refs[this.componentId].value = ''
          }).catch(err => {
            console.log(err)
          })          
        }
        reader.readAsDataURL(file)
      },
      uploadByOss () {
        // 上传到阿里云模式
        const file = this.$refs[this.componentId].files[0]
        if (file.type.split('/')[0] !== 'image') {
          return
        } 
        const imageType = file.type.split('/')[1]
        let suffix = ''
        switch (imageType) {
          case 'jpeg':
            suffix = '.jpg'
            break
          case 'gif':
            suffix = '.gif'
            break
          default:
            suffix = '.png'
        }
        const filename = util.createImgName()
        const postData = {
          filename: `${filename}${suffix}`,
          dirpath: 'demo/images/'
        }
        axios.post(`/proxy/api/upload/ossSign`, postData)
          .then((res) => {
            const {params, host, fileUrl} = res.data.result
            var formData = new FormData()
            for (var key in params) {
              formData.append(key, params[key])
            }
            // params.key = res.data.prefix + filename + suffix
            formData.append('file', file)
            let picUrl = 
            axios({
              method: 'post',
              url: host,
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              data: formData
            }).then((data) => {
              console.log('data', data)
              if (data.status === 200) {
                this.model.pictureUrl = fileUrl
                this.dispatch()
                // 将input重新取值，解决相同文件change失效
                this.$refs[this.componentId].value = ''
              }
            })
          })
        }
    },
    created () {
      // console.log('created', this)
    }
  }
</script>
