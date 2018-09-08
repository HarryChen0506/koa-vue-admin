<template>
  <div class="app-container home">
    
    <el-button type="primary" @click="showInfo">
        富文本<i class="el-icon-upload el-icon--right"></i>
    </el-button>
		<el-button type="primary" @click="getHtml">
        getHtml
    </el-button>
		<el-button type="primary" @click="getText">
        getText
    </el-button>
    <div class="editor-wrap">
      <wang-editor ref="demoEditor" v-model="demo" :config="{uploadImgShowBase64: true}" @change="changeContent"/>
    </div>
    <div style="margin-top: 20px">
      html: {{demo}}
    </div> 

  </div>  
</template>
<style lang="less"  scoped>
	.editor-wrap {
		margin-top: 20px;
		width: 100%;
	}
</style>
<script>
// @ is an alias to /src
import axios from '@/services/axios'
import request from '@/services/request'
import WangEditor from '@/components/WangEditor'


export default {
  name: 'upload',
  components: {
    WangEditor
  },
  data () {
    return {
      demo: '<h1>Hello</h1>'
    }
  },
  methods: {
    showInfo () {
			console.log('this', this.$refs.demoEditor)
		},
		getHtml () {
			const reuslt = this.$refs.demoEditor.getHtml()
			console.log('getHtml', reuslt)
		},
		getText () {
			const reuslt = this.$refs.demoEditor.getText()
			console.log('getText', reuslt)
    },
    changeContent (content) {
      console.log('change content', content)
    }
  }
}
</script>