<template>
  <div class="page-user"> 
    <section class="info">
      <el-card class="box-card">
        <div class="info-wrap">
          <div class="info-img">
            <img :src="articleInfo.coverUrl" alt="articleInfo.title">
          </div>
          <div class="info-text">
            <div class="info-title">{{articleInfo.title}}</div>
            <div class="info-writer">
              <span v-for="item in articleInfo.writers" :key="item.name">{{item.name}}</span>
            </div>
            <div class="info-category">
              <span>{{articleInfo.mainCategoryId && articleInfo.mainCategoryId.categoryname}}</span>
            </div>
            <div class="info-tag">
              <el-tag style="margin-right: 5px" size="mini" v-for="item in articleInfo.tagIds" :key="item._id">{{item.tagname}}</el-tag>
            </div>
          </div>
        </div>
      </el-card> 
    </section>   
    <section class="search">          
			<el-form :inline="true" class="search-form" size="mini">
				<el-form-item label="章节ID">
					<el-input 
						placeholder="章节ID"
						size="mini"
						v-model.lazy="queryParams.id"
						@blur="search"
						clearable
					>
					</el-input>
				</el-form-item>
				<el-form-item label="章节名">
					<el-input 
						placeholder="章节名"
						size="mini"
						v-model.lazy="queryParams.chaptername"
						@blur="search"						
						clearable
					>
					</el-input>
				</el-form-item>	
				<el-form-item label="状态">
					<el-select v-model="queryParams.delete" clearable placeholder="请选择" size="mini" @change="search">
						<el-option
							v-for="item in staticModel.statusList"
							:key="item.value"
							:label="item.name"
							:value="item.value">
						</el-option>
					</el-select> 
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</section>
		<section class="main shadow">
			<el-table
				:data="tableData"
				stripe
				style="width: 100%">
				<el-table-column
					prop="sort"
					label="排序"
					width="50">
				</el-table-column>
				<el-table-column
					prop="Id"
					label="章节Id"
					width="210">
				</el-table-column>
				<el-table-column
					prop="chaptername"
					label="章节名"
					width="150">
				</el-table-column>				
				<el-table-column
					prop="delete"
					label="状态">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.delete === 1" size="mini">删除</el-tag>
						<el-tag v-else size="mini" type="danger">正常</el-tag>				
					</template>
				</el-table-column>
        <el-table-column
					label="内容"
					width="150">
          <template slot-scope="scope">
						<el-button type="primary" icon="el-icon-view" size="mini" @click="openEditDialog(scope.row)"></el-button>	
					</template>
				</el-table-column>	
				<el-table-column
					prop="updateTime"
					:formatter="formatDate"
					label="更新时间">
				</el-table-column>
				<el-table-column
					:formatter="formatDate"
					fixed="right"
					label="操作"
					width="200">
					<template slot-scope="scope">
						<el-button type="success" icon="el-icon-edit" size="mini" @click="openEditDialog(scope.row)"></el-button>
						<el-button v-if="scope.row.delete === 1" type="warning" size="mini" @click="handleRestore(scope.row)">启用</el-button>					
						<el-button v-if="scope.row.delete === 0" type="info" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>			
		</section>
		<section class="pagination">
			<el-pagination
				background
				layout="prev, pager, next"
				@current-change="handleCurrentChange"
				:current-page.sync="pagination.pageNum"
				:page-size="pagination.pageSize"
				:total="pagination.total">
			</el-pagination>
		</section>
		<section>
			<el-button 
				style="position: fixed; right: 40px; bottom: 40px; z-index: 10" 
				type="danger" 
				icon="el-icon-plus" 
				@click="openCreateDialog"
				circle ></el-button>
		</section>
    <el-dialog
      v-if="dialog.visible"
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="70%" center>    
      <el-form  @submit.native.prevent class="demo-form-inline" label-width="80px">
        <el-form-item label="文章Id">
					<span>{{dialog.model.articleId}}</span>
				</el-form-item>
				<el-form-item label="章节名">
					<el-input v-model="dialog.model.chaptername" size="mini" style="width: 200px"></el-input>
				</el-form-item>
				<el-form-item label="顺序">
					<el-input-number v-model="dialog.model.sort" controls-position="right" size="mini"></el-input-number>
				</el-form-item>        
			</el-form>
      <div class="content">
        <wang-editor ref="chapterEditor" v-model="dialog.model.content" :config="{uploadImgShowBase64: true}" @change="changeContent"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm" >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
	.page-user {
    padding: 20px;
    .info {
      .info-wrap {
        display: flex;
        flex-direction: row;
        .info-img {
          width: 100px;
          min-height: 100px;
          // background: red
          img {
            width: 100%
          }
        }
        .info-text {
          width: 200px;
          height: 100px;
          margin-left: 20px;
          line-height: 20px;
          .info-title {
            margin-top: 20px;
          }
          .info-writer {
            font-size: 12px;
            margin-top: 10px;
            span {
              margin-right: 10px
            }
          }
          .info-category {
            font-size: 12px;
            margin-top: 10px;
            font-weight: 700;
          }
          .info-tag {
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
    }
		.search {
			margin-top: 30px;
		}
		.main {
			margin-top: 20px;
			padding: 20px;
		}
		.pagination {
			margin-top: 30px;
			display: flex;
			justify-content: flex-start;
		}	
	}
</style>
<style lang="less">
	.el-form-item__label {
		font-weight: 500
	}
</style>

<script>
// @ is an alias to /src
// import axios from '@/services/axios'
import moment from 'moment'
import util from '@/utils/util'
import request from '@/services/request'
import ImageUpload from '@/components/ImageUpload'
import WangEditor from '@/components/WangEditor'
moment.locale('zh-cn')

export default {
	name: 'user',
	components: {
    ImageUpload,
    WangEditor
  },
  data () {
    return {
			queryParams: {				
				chaptername: '',
				id: '',
				delete: ''
			},
			pagination: {
				pageSize: 10,
				pageNum: 1,
				total: 0
      },
      articleId: '',
      articleInfo: {},
			tableData: [
				// {
				// 	"_id": "5b2f5831ed590f0394fe7622"		
				// }
			],
			staticModel: {
				categoryList: [],
				tagList: [],
				statusList: [
					{name: '删除', value: 1},
					{name: '正常', value: 0}
				]
			},
			dialog: {
				type: '',
				title: '',
				visible: false,
				initData: {
					stock: null,
          id: '',
          sort: 1,
          articleId: '',
          chaptername: '',
          content: ''
				},
				model: {
					stock: null,
          id: '',
          sort: 1,
          articleId: '',
          chaptername: '',
          content: ''
				}
			}
    }
	},
	computed: {
		postData: function () {
			const {dialog = {}} = this
			const {model = {}} = dialog
      const {chaptername, articleId, content, sort} = model
      const postData = {chaptername, articleId, content, sort}
      return postData
		},
		putData: function () {
			const {dialog = {}} = this
			const {model = {}} = dialog
			const {id, chaptername, content, sort} = model
      const putData = {id, chaptername, content, sort}
      return putData
		}
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route' () {
      this.getChapterId()
      console.log('watch')
		}
  },
  created () {    
    this.getChapterId()
  },
	mounted () {
    this.queryArticleInfo()
		this.search()
		this.queryAllRoles()
	},
  methods: {
    getChapterId () {
      this.articleId = this.$route.params.id
    },
		search () {
			this.pagination.pageNum = 1
			this.query()
		},
		async query () {
      const {pageNum, pageSize} = this.pagination
      const articleId = this.articleId
      if (!articleId) {
        this.$message.error('未获取到文章id, 无法查询章节!')
        return
      }
      const query = {...this.queryParams, pageNum, pageSize, articleId}
			console.log('query', query)
			try {
        const result = await request.literature.chapter.getChapterByParams({query}) 
				const {data} = result
				// console.log('data', data)
				if (data.success) {
					this.tableData = data.result.list
					this.pagination.total = data.result.total
				}				
      } catch (err) {
				console.log(err)
				this.$message.error('获取用户列表失败!')
      }      
    },
    // 获取文章信息
    async queryArticleInfo () {      
			const query = {id: this.articleId}
			try {
        const result = await request.literature.article.getArticleByParams({query}) 
				const {data} = result
				// console.log('data', data)
				if (data.success) {
					this.articleInfo = data.result.list[0]
				}				
      } catch (err) {
				console.log(err)
				this.$message.error('获取文章信息失败!')
      }      
    },
		async queryAllRoles () {
			try {
        const result = await request.role.getAllRoles()  
				const {data} = result
				console.log('data', data)
				if (data.success) {
					this.staticModel.roleList = data.result.list
				}				
      } catch (err) {
				console.log(err)
				this.$message.error('获取角色列表失败!')
      }     
		},
		handleCurrentChange () {
			this.query()
		},
		formatDate (row, column, cellValue) {
			return moment(new Date(cellValue)).format('lll')
		},
		openCreateDialog () {
			this.dialog.visible = true
			this.dialog.type = 'create'
			this.dialog.title = '新增章节'
      this.dialog.model = util.deepClone(this.dialog.initData)
      this.dialog.model.articleId = this.articleId
		},
		openEditDialog (item) {
			this.dialog.visible = true
			this.dialog.type = 'edit'
			this.dialog.title = '编辑章节'	
			this.dialog.model = util.deepClone(this.dialog.initData)		
			this.parseFetchData(item, this.dialog.model)
		},
		parseFetchData (item = {}, model) {
			const {Id, articleId, chaptername, content, sort} = item
      model.id = Id
      model.articleId = articleId
			model.chaptername = chaptername
			model.content = content
			model.sort = sort
		},		
		closeDialog () {
			this.dialog.visible = false
			this.dialog.type = ''
			this.dialog.title = ''
			this.dialog.model = util.deepClone(this.dialog.initData)
		},
		dialogConfirm () {
			// console.log('confirm', this.dialog)
			const type = this.dialog.type
			if (type === 'create') {
				this.createChapter()
			} else if (type === 'edit') {
				this.editChapter()
			}
		},
		createChapter () {
			this.http_create_chapter(() => {
				this.$message({
					showClose: true,
					message: '创建章节成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '创建章节失败')
			})
		},
		editChapter () {
			this.http_edit_chapter(() => {
				this.$message({
					showClose: true,
					message: '修改章节成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '修改章节失败')
			})
		},
		async http_create_chapter (sucNext, failNext) {			
			const postData = this.postData
			// console.log('postData', postData)
			try {
        const result = await request.literature.chapter.createChapter(postData) 
				const {data} = result
				if (data.success) {
					typeof sucNext === 'function' && sucNext(data)
				} else {
					typeof failNext === 'function' && failNext(data)
				}		
      } catch (err) {
				typeof failNext === 'function' && failNext(err)
      }   
		},
		async http_edit_chapter (sucNext, failNext) {
			const putData = this.putData
			this.http_update_chapter(putData, sucNext, failNext)  
		},
		async http_update_chapter (data, sucNext, failNext) {
			const {id, ...rest} = data
			const putData = {id, ...rest}
			try {
        const result = await request.literature.chapter.updateChapter(putData) 
				const {data} = result
				if (data.success) {
					typeof sucNext === 'function' && sucNext(data)
				} else {
					typeof failNext === 'function' && failNext(data)
				}		
      } catch (err) {
				typeof failNext === 'function' && failNext(err)
      }  
		},
		handleRestore (item) {
			const putData = {
				id: item.Id,
				delete: 0
			}
			this.http_update_chapter(putData, () => {
				this.$message({
					showClose: true,
					message: '恢复成功',
					type: 'success'
				})
				this.query()
			}, (err) => {
				this.$message.error(err || '恢复失败')
			})
		},
		handleDelete (item) {
			const putData = {
				id: item.Id,
				delete: 1
			}
			this.$confirm('确认删除吗？').then(() => {
        this.http_update_chapter(putData, () => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.query()
        }, (err) => {
          this.$message.error(err || '删除失败')
        })
      }).catch(() => {})

    },
    changeContent (content) {
      // console.log('change content', content)
    }
  }
}
</script>