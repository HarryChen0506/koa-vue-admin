<template>
  <div class="image-upload-container"> 
    <div class="input-wrap">
      <input class="input hidden" :ref="fileLoadId" type="file" :id="fileLoadId" :name="fileLoadId" @change="upload()">
      <el-button class="button" type="primary" size="mini">
        <label :for="fileLoadId">
          上传<i class="el-icon-upload el-icon--right"></i>
        </label>
      </el-button>
    </div> 
    <!-- <el-button type="primary" size="mini" @click="dispatch">
        发给父组件
    </el-button> -->
    <ul class="file-list">
      <li v-for="(item, index) in model.fileList" :key="index">
        <a :href="item.url" target="_blank">
          <span class="file-name">{{item.name}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="less"  scoped>
  .image-upload-container {
    display: inline-block;    
    .input-wrap {
      position: relative;
    }
    .input {
      position: absolute;
      width: 100%;
      height: 100%;
      background: red;      
    }
    .button {
    }
    .file-list {
      li {
        margin: 10px 0;
      }
      .file-name {
        color: #409EFF;
        text-decoration: underline;
      }
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
          fileList: []
        }
      }
    },
    mounted () { 
    },
    methods: {
      dispatch () {
        // console.log('通知父组件', this.$refs)
        this.$emit('output-file', this.model)
      },
      upload () {
        const file = this.$refs[this.fileLoadId].files[0]               
        var formData=new FormData();
        formData.append('file',file);
        
        let url = '/proxy/api/upload/file'
        axios({
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        }).then( res => {
          console.log(res);
          this.getFileInfo(res.data)
          // 将input重新取值，解决相同文件change失效
          this.$refs[this.fileLoadId].vaiue = ''
          this.dispatch()
        })
        .catch(function (error) {
          console.log(error);
        })
      },
      getFileInfo (data) {
        const item = {
          name: data.file && data.file.name,
          url: `//${data.fileUrl}`
        }
        this.model.fileList.push(item)
      }
    },
    created () {
      // console.log('created', this)
    }
  }
</script>
