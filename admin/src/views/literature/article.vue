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
					label="文章Id"
					width="210">
				</el-table-column>
				<el-table-column
					prop="title"
					label="文章名">
				</el-table-column>
				<el-table-column
					label="作者">
					<template slot-scope="scope">
						<span style="margin-right: 5px" size="mini" v-for="item in scope.row.writers" :key="item._id">{{item.name}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="main_category_id"
					label="分类">					
				</el-table-column>
				<el-table-column
					label="标签">
					<template slot-scope="scope">
						<el-tag style="margin-right: 5px" size="mini" v-for="item in scope.row.tagIds" :key="item._id">{{item.tagname}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					label="封面">
					<template slot-scope="scope">
						<span style="display: inline-block; width: 50px; height: 50px;border-radius: 50px; overflow: hidden">
							<img style="width: 100%; height: 100%" v-if="scope.row.coverUrl" :src="scope.row.avatar" alt="封面">
						</span>
					</template>
				</el-table-column>
				<!-- <el-table-column
					prop="active"
					label="状态">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.active === 1" size="mini">启用</el-tag>
						<el-tag v-else size="mini" type="danger">禁用</el-tag>						
					</template>
				</el-table-column>				 -->
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
						<el-button :type="scope.row.active === 1 ? 'danger' : 'warning'" size="mini" @click="handleActive(scope.row)">
							{{scope.row.active === 1 ? '禁用' : '启用'}}
						</el-button>
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
      width="50%" center>    
      <el-form  @submit.native.prevent class="demo-form-inline" label-width="80px">
				<el-form-item label="文章名">
					<el-input v-model="dialog.model.title" size="mini" style="width: 600px"></el-input>
				</el-form-item>
				<el-form-item label="作者">
					<el-row :gutter="12">						
						<el-col :span="8" v-for = "item in dialog.model.writers" :key="item.name">
							<div class="my-card">
								<el-input type="text"  v-model="item.name" placeholder="作者" :autosize="{ minRows: 1, maxRows: 1}" size="mini"></el-input>
								<el-input
									type="textarea"
									:autosize="{ minRows: 2, maxRows: 5}"
									placeholder="作者简介"
									v-model="item.info">
								</el-input>
							</div>
						</el-col>							
						<el-button type="success" icon="el-icon-plus" size="mini"></el-button>		
					</el-row>
				</el-form-item>
				<el-form-item label="国家">
					<el-input v-model="dialog.model.country" size="mini" style="width: 100px"></el-input>
				</el-form-item>
				<el-form-item label="封面图片">
					<image-upload fileLoadId="image_upload_1" @output-image="getCoverImage" :oss="true" dir-path="demo/image/"></image-upload>
					<span style="display: inline-block; width: 80px; vertical-align: middle; margin-left: 20px">
						<img style="width: 100%" v-if="dialog.model.coverUrl" :src="dialog.model.coverUrl" alt="用户头像">
					</span>
				</el-form-item>	
				<el-form-item label="摘要">
					<el-input v-model="dialog.model.abstract"	type="textarea"	:autosize="{ minRows: 2, maxRows: 5}"	placeholder="摘要"></el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model="dialog.model.categoryIds" multiple placeholder="请选择分类">
						<el-option
							v-for="item in staticModel.categoryList"
							:key="item._id"
							:label="item.categoryname"
							:value="item._id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主分类">
					<el-select v-model="dialog.model.mainCategoryId"  placeholder="请选择主分类">
						<el-option
							v-for="item in staticModel.categoryList"
							:key="item._id"
							:label="item.categoryname"
							:value="item._id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="标签">
					<el-select v-model="dialog.model.tagIds" multiple placeholder="请选择主分类">
						<el-option
							v-for="item in staticModel.tagList"
							:key="item._id"
							:label="item.tagname"
							:value="item._id">
						</el-option>
					</el-select>
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
		.my-card {
			border: 1px solid #ebeef5;
			background-color: #fff;
			padding: 20px;
			color: #303133;
			-webkit-transition: .3s;
			transition: .3s;
			box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
			border-radius: 4px; 
      overflow: hidden;
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
					title: '', // 文章名
					writers: [{name: '', info: ''}], // 作者列表 作者名 作者简介
					coverUrl: '', // 封面
					country: '', // 国家
					abstract: '', // 摘要
					tagIds: [], // 标签
					categoryIds: [], // 分类
					mainCategoryId: '', // 主分类
				},
				model: {
					stock: null,
					id: '',
					title: '', // 文章名
					writers: [{name: '', info: ''}], // 作者列表 作者名 作者简介
					coverUrl: '', // 封面
					country: '', // 国家
					abstract: '', // 摘要
					tagIds: [], // 标签
					categoryIds: [], // 分类
					mainCategoryId: '', // 主分类
				}
			}
    }
	},
	computed: {
		postData: function () {
			const { dialog = {} } = this
			const {model = {}} = dialog
      const {title, writers, coverUrl, country, abstract, tagIds, categoryIds, mainCategoryId} = model
      const postData = {title, writers, coverUrl, country, abstract, tagIds, categoryIds, mainCategoryId} 
      return postData
    },
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
        const result = await request.literature.article.getArticleByParams({query}) 
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
			this.dialog.title = '新增文章'
			this.dialog.model = util.deepClone(this.dialog.initData)			
		},
		openEditDialog (item) {
			console.log('编辑文章', item)
			this.dialog.visible = true
			this.dialog.type = 'edit'
			this.dialog.title = '编辑用户'	
			this.dialog.model = util.deepClone(this.dialog.initData)		
			this.parseUserData(item, this.dialog.model)
		},
		parseUserData (item = {}, model) {
			const {_id, username, role = [], avatar} = item
			model.id = _id
			model.username = username
			model.role = role.map(v => v._id)
			model.avatar = avatar
			model.stock = util.deepClone(item)	
		},
		getCoverImage (data) {
			this.dialog.model.coverUrl = data.pictureUrl
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
				this.createArticle()
			} else if (type === 'edit') {
				this.editUser()
			}
		},
		createArticle () {
			this.http_create_article(() => {
				this.$message({
					showClose: true,
					message: '创建文章成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '创建文章失败')
			})
		},
		editUser () {
			this.http_edit_user(() => {
				this.$message({
					showClose: true,
					message: '修改用户成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '修改用户失败')
			})
		},
		async http_create_article (sucNext, failNext) {
			
			const postData = this.postData
			console.log('postData', postData)
			try {
        const result = await request.literature.article.createArticle(postData) 
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
			const {id, username, changePassword, newPassword, role, avatar, stock} = this.dialog.model
			const putData = {id, role}
			if (changePassword) {
				putData.password = newPassword
			}
			if (username !== stock.username) {
				putData.username = username
			}
			if (avatar !== stock.avatar) {
				putData.avatar = avatar
			}
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
		},
		async http_update_user (data, sucNext, failNext) {
			const {id, ...rest} = data
			const putData = {id, ...rest}
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
		},
		handleActive (user) {
			const status = user.active === 0 ? 1 : 0
			const data = {
				id: user._id,
				active: status
			}
			this.http_update_user(data, () => {
				this.$message({
					showClose: true,
					message: '修改用户状态成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '修改用户状态失败')
			})
		}
  }
}
</script>