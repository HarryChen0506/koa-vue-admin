<template>
  <div class="page-user">    
    <section class="search">
			<el-form :inline="true" class="search-form" size="mini">
				<el-form-item label="作品ID">
					<el-input 
						placeholder="作品ID"
						size="mini"
						v-model.lazy="queryParams.worksId"
						@blur="search"
						clearable
					>
					</el-input>
				</el-form-item>
				<el-form-item label="审批人">
					<el-input v-model="queryParams.user" placeholder="审批人"></el-input>
				</el-form-item>
				<el-form-item label="活动区域">
					<el-select v-model="queryParams.user" placeholder="活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
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
					prop="date"
					label="日期"
					width="180">
				</el-table-column>
				<el-table-column
					prop="name"
					label="姓名"
					width="180">
				</el-table-column>
				<el-table-column
					prop="address"
					label="地址">
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
	.shadow {
		border-width: 1px;
    border-style: solid;
    border-color: rgb(235, 235, 235);
    border-image: initial;
    border-radius: 3px;
    transition: all 0.2s ease 0s;
	}
	.shadow:hover {
		box-shadow: rgba(232, 237, 250, 0.6) 0px 0px 8px 0px, rgba(232, 237, 250, 0.5) 0px 2px 4px 0px;
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
// import util from '@/services/util'
import request from '@/services/request'

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
				{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
				}
			]
    }
  },
  methods: {
		search () {
			console.log('search')
		}    
  }
}
</script>