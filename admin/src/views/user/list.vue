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
					prop="_id"
					label="用户Id"
					width="210">
				</el-table-column>
				<el-table-column
					prop="username"
					label="用户名">
				</el-table-column>
				<el-table-column
					prop="avatar"
					label="头像">
					<template slot-scope="scope">
						<span style="display: inline-block; width: 50px; height: 50px;border-radius: 50px; overflow: hidden">
							<img style="width: 100%; height: 100%" v-if="scope.row.avatar" :src="scope.row.avatar" alt="用户头像">
						</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="create_time"
					:formatter="formatDate"
					label="注册时间">
				</el-table-column>
				<el-table-column
					prop="update_time"
					:formatter="formatDate"
					label="更新时间">
				</el-table-column>
				<el-table-column
					prop="update_time"
					:formatter="formatDate"
					label="操作"
					width="260">
					<template slot-scope="scope">
						<el-button type="success" icon="el-icon-edit" size="mini" @click="openEditDialog(scope.row)"></el-button>
						<el-button type="success" size="mini">启用</el-button>
						<el-button type="success" size="mini">禁用</el-button>
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
				style="position: fixed; right: 40px; bottom: 40px" 
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
      <el-form  @submit.native.prevent class="demo-form-inline" label-width="60px">
				<el-form-item label="用户名">
					 <el-input v-model="dialog.model.username" style="width: 200px"></el-input>
				</el-form-item>
				<el-form-item label="密码" v-if="dialog.type === 'create'">
					 <el-input v-model="dialog.model.password" style="width: 200px"></el-input>
				</el-form-item>
				<el-form-item label="新密码" v-if="dialog.type === 'edit'">					
					<el-input v-if="dialog.model.changePassword" v-model="dialog.model.newPassword" style="width: 200px"></el-input>
					<el-switch
						v-model="dialog.model.changePassword"
						style="margin-left: 20px"
						active-color="#13ce66"
						inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
				<el-form-item label="头像">
					<image-upload fileLoadId="image_upload_2" @output-image="getAvatarImage" :oss="true" dir-path="demo/image/"></image-upload>
					<span style="display: inline-block; width: 80px; vertical-align: middle; margin-left: 20px">
						<img style="width: 100%" v-if="dialog.model.avatar" :src="dialog.model.avatar" alt="用户头像">
					</span>
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
				// 	"_id": "5b2f5831ed590f0394fe7622",
				// 	"username": "harry",
				// 	"password": "123",
				// 	"create_time": "2018-06-24T08:37:05.757Z",
				// 	"update_time": "2018-06-24T08:37:05.760Z",
				// 	"__v": 0
				// }
			],
			dialog: {
				type: '',
				title: '',
				visible: false,
				initData: {
					stock: null,
					id: '',
					username: '',
					password: '',
					changePassword: false,
					newPassword: '',
					avatar: 'http://static01-harry.oss-cn-hangzhou.aliyuncs.com/demo/image/5863-f184-ed2e-a081-5c19.jpg',						
				},
				model: {
					stock: null,
					id: '',
					username: '',
					password: '',	
					changePassword: false,
					newPassword: '',
					avatar: '',
				}
			}
    }
	},
	mounted () {
		this.search()
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
        const result = await request.user.getUserByParams({query}) 
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
		handleCurrentChange () {
			this.query()
		},
		formatDate (row, column, cellValue) {
			return moment(new Date(cellValue)).format('lll')
		},
		openCreateDialog () {
			console.log('新增用户')
			this.dialog.visible = true
			this.dialog.type = 'create'
			this.dialog.title = '新增用户'
			this.dialog.model = util.deepClone(this.dialog.initData)			
		},
		openEditDialog (item) {
			console.log('编辑用户', item)
			this.dialog.visible = true
			this.dialog.type = 'edit'
			this.dialog.title = '编辑用户'	
			this.dialog.model = util.deepClone(this.dialog.initData)		
			this.parseUserData(item, this.dialog.model)
		},
		parseUserData (item = {}, model) {
			const {_id, username, avatar} = item
			model.id = _id
			model.username = username
			model.avatar = avatar
			model.stock = util.deepClone(item)	
		},
		getAvatarImage (data) {
			this.dialog.model.avatar = data.pictureUrl
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
				this.createUser()
			} else if (type === 'edit') {
				this.editUser()
			}
		},
		createUser () {
			this.http_create_user(() => {
				this.$message({
					showClose: true,
					message: '创建用户成功',
					type: 'success'
				})
				this.closeDialog()
			}, err => {
				this.$message.error(err || '创建用户失败')
			})
		},
		editUser () {
			this.http_edit_user(() => {
				this.$message({
					showClose: true,
					message: '修改用户成功',
					type: 'success'
				})
				this.closeDialog()
			}, err => {
				this.$message.error(err || '修改用户失败')
			})
		},
		async http_create_user (sucNext, failNext) {
			const  {username, password, avatar} = this.dialog.model
			const postData = {username, password, avatar}
			try {
        const result = await request.user.createUser(postData) 
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
		async http_edit_user (sucNext, failNext) {
			const {id, username, changePassword, newPassword, avatar, stock} = this.dialog.model
			const putData = {id}
			if (changePassword) {
				putData.password = newPassword
			}
			if (username !== stock.username) {
				putData.username = username
			}
			if (avatar !== stock.avatar) {
				putData.avatar = avatar
			}
			console.log('putData', putData)
			try {
        const result = await request.user.updateUser(putData) 
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