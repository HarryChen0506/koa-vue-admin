<template>
  <div class="page-user">    
    <section class="search">
			<el-form :inline="true" class="search-form" size="mini">
				<el-form-item label="用户ID">
					<el-input 
						placeholder="用户ID"
						size="mini"
						v-model.lazy="queryParams.id"
						@blur="search"
						clearable
					>
					</el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input 
						placeholder="用户名"
						size="mini"
						v-model.lazy="queryParams.username"
						@blur="search"						
						clearable
					>
					</el-input>
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
					type="index"
					label="顺序"
					width="50">
				</el-table-column>
				<el-table-column
					prop="Id"
					label="分类Id"
					width="210">
				</el-table-column>
				<el-table-column
					prop="categoryname"
					label="分类名"
					width="150">
				</el-table-column>
				<el-table-column
					prop="count"
					label="文章数量"
					width="150">
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
						<el-button type="info" icon="el-icon-delete" size="mini"></el-button>
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
      width="30%" center>    
      <el-form  @submit.native.prevent class="demo-form-inline" label-width="80px">
				<el-form-item label="分类名">
					<el-input v-model="dialog.model.categoryname" size="mini" style="width: 100%"></el-input>
				</el-form-item>
			</el-form>      
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
		.search {
			margin-top: 20px;
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
moment.locale('zh-cn')

export default {
	name: 'user',
	components: {
    ImageUpload
  },
  data () {
    return {
			queryParams: {				
				username: '',
				id: ''
			},
			pagination: {
				pageSize: 10,
				pageNum: 1,
				total: 0
			},
			tableData: [
				// {
				// 	"_id": "5b2f5831ed590f0394fe7622"		
				// }
			],
			staticModel: {
				categoryList: [],
				tagList: []
			},
			dialog: {
				type: '',
				title: '',
				visible: false,
				initData: {
					stock: null,
					id: '',
					categoryname: ''
				},
				model: {
					stock: null,
					id: '',
					categoryname: ''
				}
			}
    }
	},
	computed: {
		postData: function () {
			const {dialog = {}} = this
			const {model = {}} = dialog
      const {categoryname} = model
      const postData = {categoryname}
      return postData
		},
		putData: function () {
			const { dialog = {} } = this
			const {model = {}} = dialog
			 const {id, categoryname} = model
      const putData = {id, categoryname} 
      return putData
		}
	},
	mounted () {
		this.search()
		this.queryAllRoles()
	},
  methods: {
		search () {
			console.log('search')
			this.pagination.pageNum = 1
			this.query()
		},
		async query () {
			const {pageNum, pageSize} = this.pagination
			const query = {...this.queryParams, pageNum, pageSize}
			console.log('query', query)
			try {
        const result = await request.literature.category.getCategoryByParams({query}) 
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
			this.dialog.title = '新增分类'
			this.dialog.model = util.deepClone(this.dialog.initData)			
		},
		openEditDialog (item) {
			this.dialog.visible = true
			this.dialog.type = 'edit'
			this.dialog.title = '编辑分类'	
			this.dialog.model = util.deepClone(this.dialog.initData)		
			this.parseFetchData(item, this.dialog.model)
		},
		parseFetchData (item = {}, model) {
			const {Id, categoryname} = item
			model.id = Id
			model.categoryname = categoryname
		},		
		closeDialog () {
			this.dialog.visible = false
			this.dialog.type = ''
			this.dialog.title = ''
			this.dialog.model = util.deepClone(this.dialog.initData)
		},
		dialogConfirm () {
			console.log('confirm')
			const type = this.dialog.type
			if (type === 'create') {
				this.createCategory()
			} else if (type === 'edit') {
				this.editCategory()
			}
		},
		createCategory () {
			this.http_create_category(() => {
				this.$message({
					showClose: true,
					message: '创建分类成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '创建分类失败')
			})
		},
		editCategory () {
			this.http_edit_category(() => {
				this.$message({
					showClose: true,
					message: '修改分类成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '修改分类失败')
			})
		},
		async http_create_category (sucNext, failNext) {			
			const postData = this.postData
			console.log('postData', postData)
			try {
        const result = await request.literature.category.createCategory(postData) 
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
		async http_edit_category (sucNext, failNext) {
			const putData = this.putData
			console.log('putData', putData)
			// return
			this.http_update_category(putData, sucNext, failNext)  
		},
		async http_update_category (data, sucNext, failNext) {
			const {id, ...rest} = data
			const putData = {id, ...rest}
			try {
        const result = await request.literature.category.updateCategory(putData) 
				const {data} = result
				if (data.success) {
					typeof sucNext === 'function' && sucNext(data)
				} else {
					typeof failNext === 'function' && failNext(data)
				}		
      } catch (err) {
				typeof failNext === 'function' && failNext(err)
      }  
		}		
  }
}
</script>