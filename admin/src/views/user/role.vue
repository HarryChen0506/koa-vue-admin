<template>
  <div class="page-role">    
    <section class="search">
			<el-form :inline="true" class="search-form" size="mini">
				<el-form-item label="角色ID">
					<el-input 
						placeholder="角色ID"
						size="mini"
						v-model.lazy="queryParams.id"
						@blur="search"
						clearable
					>
					</el-input>
				</el-form-item>
				<el-form-item label="角色名">
					<el-input 
						placeholder="角色名"
						size="mini"
						v-model.lazy="queryParams.rolename"
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
					label="角色Id"
					width="210">
				</el-table-column>
				<el-table-column
					prop="rolename"
					label="角色名">
				</el-table-column>
				<el-table-column
					prop="rolecode"
					label="角色码">
				</el-table-column>				
				<el-table-column
					prop="active"
					label="状态">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.active === 1" size="mini">启用</el-tag>
						<el-tag v-else size="mini" type="danger">禁用</el-tag>						
					</template>
				</el-table-column>
				<el-table-column
					prop="create_time"
					:formatter="formatDate"
					label="创建时间">
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
      width="30%" center>    
      <el-form  @submit.native.prevent class="demo-form-inline" label-width="60px">
				<el-form-item label="角色名">
					<el-input v-model="dialog.model.rolename" style="width: 200px"></el-input>
				</el-form-item>
				<el-form-item label="角色码">
					<el-input v-model="dialog.model.rolecode" style="width: 200px"></el-input>
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
	.page-role {
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
// import ImageUpload from '@/components/ImageUpload'
moment.locale('zh-cn')

export default {
	name: 'role',
	components: {},
  data () {
    return {
			queryParams: {				
				rolename: '',
				id: ''
			},
			pagination: {
				pageSize: 10,
				pageNum: 1,
				total: 0
			},
			tableData: [],
			dialog: {
				type: '',
				title: '',
				visible: false,
				initData: {
					stock: null,
					id: '',
					rolename: '',
					rolecode: ''	
				},
				model: {
					stock: null,
					id: '',
					rolename: '',
					rolecode: ''
				}
			}
    }
	},
	mounted () {
		this.search()
	},
  methods: {
		search () {
			// console.log('search')
			this.pagination.pageNum = 1
			this.query()
		},
		async query () {
			const {pageNum, pageSize} = this.pagination
			const query = {...this.queryParams, pageNum, pageSize}
			// console.log('query', query)
			try {
        const result = await request.role.getRoleByParams({query}) 
				const {data} = result
				// console.log('data', data)
				if (data.success) {
					this.tableData = data.result.list
					this.pagination.total = data.result.total
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
			this.dialog.title = '新增角色'
			this.dialog.model = util.deepClone(this.dialog.initData)			
		},
		openEditDialog (item) {
			// console.log('编辑角色', item)
			this.dialog.visible = true
			this.dialog.type = 'edit'
			this.dialog.title = '编辑角色'
			this.dialog.model = util.deepClone(this.dialog.initData)
			this.parseRoleData(item, this.dialog.model)
		},
		parseRoleData (item = {}, model) {
			const {_id, rolename, rolecode} = item
			model.id = _id
			model.rolename = rolename
			model.rolecode = rolecode
			model.stock = util.deepClone(item)
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
				this.createRole()
			} else if (type === 'edit') {
				this.editRole()
			}
		},
		createRole () {
			this.http_create_role(() => {
				this.$message({
					showClose: true,
					message: '创建角色成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '创建角色失败')
			})
		},
		editRole () {
			this.http_edit_role(() => {
				this.$message({
					showClose: true,
					message: '修改角色成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '修改角色失败')
			})
		},
		async http_create_role (sucNext, failNext) {
			const  {rolename, rolecode} = this.dialog.model
			const postData = {rolename, rolecode}
			try {
        const result = await request.role.createRole(postData) 
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
		async http_edit_role (sucNext, failNext) {
			const {id, rolename, rolecode, stock} = this.dialog.model
			const putData = {id}			
			if (rolename !== stock.rolename) {
				putData.rolename = rolename
			}
			if (rolecode !== stock.rolecode) {
				putData.rolecode = rolecode
			}
			this.http_update_role(putData, sucNext, failNext)
		},
		async http_update_role (data, sucNext, failNext) {
			const {id, ...rest} = data
			if (!id) {
				typeof failNext === 'function' && failNext('没有id,修改失败')
				return
			}
			const putData = {id, ...rest}
			try {
        const result = await request.role.updateRole(putData) 
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
			this.http_update_role(data, () => {
				this.$message({
					showClose: true,
					message: '修改角色状态成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '修改角色状态失败')
			})
		}
  }
}
</script>