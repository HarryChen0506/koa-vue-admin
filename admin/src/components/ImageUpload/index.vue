<template>
  <div class="image-upload-container">    
    <input class="input hidden" :ref="fileLoadId" type="file" :id="fileLoadId" :name="fileLoadId" @change="upload()">
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
  import util from '@/services/util'
  // import {convertBase64UrlToBlob} from '~/plugins/compressImg'
  export default {
    name: 'imageUpload',
    props: ['config', 'fileLoadId'],
    data () {
      return {
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
        const file = this.$refs[this.fileLoadId].files[0]
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
            this.$refs[this.fileLoadId].value = ''
          }).catch(err => {
            console.log(err)
          })          
        }
        reader.readAsDataURL(file)
      }
    },
    created () {
      // console.log('created', this)
    }
  }
</script>
