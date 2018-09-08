<template>
  <div :id="this.editorId">
   
  </div>
</template>

<style lang="less"  scoped>
 
</style>

<script>
	// 基于wangeditor封装的vue组件
	import wangEditor from 'wangeditor'
  const defaultConfig = {
		uploadImgShowBase64: true,
		uploadImgServer: false,
		uploadImgServerPath: '/proxy/api/upload/file',
		uploadFileName: 'file',
	}
  export default {
    name: 'wangEditor',
    props: ['id', 'value', 'config'],
    data () {
      return {
			 editorId: this.id || `editor_${Date.now()}`,
			 editorConfig: Object.assign({}, defaultConfig, this.config),
			 editor: null
      }
    },
    mounted () { 
			// console.log('config', this.config)
			this.createEditor()
    },
    methods: {
    	createEditor () {			
				this.editor = new wangEditor('#' + this.editorId)
				// 图片上传 base64
				if (this.editorConfig.uploadImgShowBase64) {
					this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
				} else if (this.editorConfig.uploadImgServer) {					
					this.editor.customConfig.uploadImgServer = this.editorConfig.uploadImgServerPath  // 上传图片到服务器
					this.editor.customConfig.uploadFileName = this.editorConfig.uploadFileName
					this.editor.customConfig.uploadImgHooks = {
						before: function (xhr, editor, files) {
								// 图片上传之前触发
								// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
								
								// 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
								// return {
								//     prevent: true,
								//     msg: '放弃上传'
								// }
						},
						success: function (xhr, editor, result) {
								// 图片上传并返回结果，图片插入成功之后触发
								// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
							console.log('image result', result)
						},
						fail: function (xhr, editor, result) {
								// 图片上传并返回结果，但图片插入错误时触发
								// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
						},
						error: function (xhr, editor) {
								// 图片上传出错时触发
								// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
						},
						timeout: function (xhr, editor) {
								// 图片上传超时时触发
								// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
						},

						// 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
						// （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
						customInsert: function (insertImg, result, editor) {
								// 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
								// insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

								// 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
								console.log('customInsert', result.fileUrl)
								var url = '//' + result.fileUrl
								insertImg(url)

								// result 必须是一个 JSON 格式字符串！！！否则报错
						}
					}
				}				
				// 监听事件
				this.listenChange()
				// 初始化
				this.editor.create()
				if (this.value) {
					this.setHtml(this.value)
				}
			
		 	},
			setHtml (value) {
				this.editor.txt.html(value)
			},
			getHtml () {
				return this.editor.txt.html()
			},
			getText () {
				return this.editor.txt.text()
			},
			listenChange () {
				this.editor.customConfig.onchange = (html) => {
					this.$emit('change', html)
					this.$emit('input', html)
				}
			}
    },
    created () {
    }
  }
</script>
