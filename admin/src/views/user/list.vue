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
					width="100">
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
					prop="create_time"
					:formatter="formatDate"
					label="注册时间">
				</el-table-column>
				<el-table-column
					prop="update_time"
					:formatter="formatDate"
					label="更新时间">
				</el-table-column>
			</el-table>
		</section>
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
	}
</style>
<style lang="less">
	.el-form-item__label {
		font-weight: 500
	}
</style>

<script>
// @ is an alias to /src
import axios from '@/services/axios'
import moment from 'moment'
// import util from '@/services/util'
import request from '@/services/request'
moment.locale('zh-cn')

export default {
  name: 'user',
  components: {
  },
  data () {
    return {
			queryParams: {				
				username: '',
				id: ''
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
			]
    }
	},
	mounted () {
		this.search()
	},
  methods: {
		search () {
			console.log('search')
			this.query()
		},
		async query () {
			const query = this.queryParams
			console.log('query', query)
			try {
        const result = await request.user.getUserByParams({query}) 
				const {data} = result
				console.log('data', data)
				if (data.success) {
					this.tableData = data.result
				}
      } catch (err) {
        
      }      
		},
		formatDate (row, column, cellValue, index) {
			return moment(new Date(cellValue)).format('lll')
		}
  }
}
</script>