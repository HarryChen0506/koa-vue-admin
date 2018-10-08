<template>
  <div class="page-user">    
    <section class="search">
			<el-form :inline="true" class="search-form" size="mini">
				<el-form-item label="文章ID" >
					<el-input 
						placeholder="文章ID"
						size="mini"
						v-model.lazy="queryParams.id"
						@blur="search"
						clearable
						style="width: 150px"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="文章名">
					<el-input 
						placeholder="文章名"
						size="mini"
						v-model.lazy="queryParams.title"
						@blur="search"						
						clearable
						style="width: 150px"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="作者">
					<el-input 
						placeholder="作者"
						size="mini"
						v-model.lazy="queryParams.writerName"
						@blur="search"						
						clearable
						style="width: 100px"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model="queryParams.mainCategoryId" clearable placeholder="请选择" size="mini" @change="search" style="width: 100px">
						<el-option
							v-for="item in staticModel.categoryList"
							:key="item.Id"
							:label="item.categoryname"
							:value="item.Id">
						</el-option>
					</el-select>
				</el-form-item>	
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="primary" icon="el-icon-setting" size="mini"
						@click="openManageTagDialog()">标签管理</el-button>
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
					label="文章Id"
					width="210">
				</el-table-column>
				<el-table-column
					prop="title"
					label="文章名"
					width="150">
				</el-table-column>
				<el-table-column
					label="作者">
					<template slot-scope="scope">
						<span style="margin-right: 5px" size="mini" v-for="item in scope.row.writers" :key="item._id">{{item.name}}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="分类">
					<template slot-scope="scope">
						<span>{{scope.row.mainCategoryId && scope.row.mainCategoryId.categoryname}}</span>
					</template>			
				</el-table-column>
				<el-table-column
					label="标签"
					width="150">
					<template slot-scope="scope">
						<div>
							<el-tag style="margin-right: 5px" size="mini" v-for="item in scope.row.tagIds" :key="item._id">{{item.tagname}}</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					label="封面">
					<template slot-scope="scope">
						<span style="display: inline-block; width: 50px; overflow: hidden">
							<img style="width: 100%; height: 100%" v-if="scope.row.coverUrl" :src="scope.row.coverUrl" alt="封面">
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
				</el-table-column> -->
				<el-table-column
					prop="updateTime"
					:formatter="formatDate"
					label="更新时间">
				</el-table-column>
				<el-table-column
					label="章节">
					<template slot-scope="scope">						
						<router-link :to="{ name: 'chapter', params: { id: scope.row.Id }}" target="_blank">
							<el-button type="primary" size="mini">查看</el-button>
						</router-link>
					</template>
				</el-table-column>
				<el-table-column
					:formatter="formatDate"
					fixed="right"
					label="操作"
					width="200">
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
      width="50%" center>    
      <el-form  @submit.native.prevent class="demo-form-inline" label-width="80px">
				<el-form-item label="文章名">
					<el-input v-model="dialog.model.title" size="mini" style="width: 600px"></el-input>
				</el-form-item>
				<el-form-item label="作者">
					<el-row :gutter="12">						
						<el-col :span="8" v-for = "(item, index) in dialog.model.writers" :key="index">
							<el-card shadow="hover">
								<el-input v-model="item.name"  placeholder="作者" size="mini"></el-input>
								<el-input
									type="textarea"
									:autosize="{ minRows: 2, maxRows: 5}"
									placeholder="作者简介"
									size="mini"
									v-model="item.info">
								</el-input>
							</el-card>
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
						<img style="width: 100%" v-if="dialog.model.coverUrl" :src="dialog.model.coverUrl" alt="封面头像">
					</span>
				</el-form-item>	
				<el-form-item label="摘要">
					<el-input v-model="dialog.model.abstract"	type="textarea"	:autosize="{ minRows: 2, maxRows: 5}"	placeholder="摘要" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model="dialog.model.categoryIds" multiple placeholder="请选择分类" size="mini">
						<el-option
							v-for="item in staticModel.categoryList"
							:key="item.Id"
							:label="item.categoryname"
							:value="item.Id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主分类">
					<el-select v-model="dialog.model.mainCategoryId"  placeholder="请选择主分类" size="mini">
						<el-option
							v-for="item in staticModel.categoryList"
							:key="item.Id"
							:label="item.categoryname"
							:value="item.Id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="标签">
					<el-select v-model="dialog.model.tagIds" multiple placeholder="请选择主分类" size="mini">
						<el-option
							v-for="item in staticModel.tagList"
							:key="item.Id"
							:label="item.tagname"
							:value="item.Id">
						</el-option>
					</el-select>
				</el-form-item>
				
			</el-form>      
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm" >确 定</el-button>
      </span>
    </el-dialog>
		<!-- 标签管理 -->
		<el-dialog
      v-if="dialog_manage_tag.visible"
      title="标签管理"
      :visible.sync="dialog_manage_tag.visible"
      width="50%" center>
      <!-- <el-input
        placeholder="输入关键字进行过滤"
        style="width: 200px"
        v-model="dialog_manage_model.filterText">
      </el-input> -->
      <el-select v-model="dialog_manage_tag.model.filterText" clearable placeholder="请选择" size="mini" style="width: 200px;">
        <el-option
          v-for="item in dialog_manage_tag.model.data"
          :key="item.id"
          :label="item.label"
          :value="item.label">
        </el-option>
      </el-select>
      <span style="float: right">
        <el-button type="primary" size="mini" @click="openCreateLabelDialog('new')">
          <i class="el-icon-plus el-icon--left"> 新增标签</i>
        </el-button>
      </span>  
      <el-tree
        style="margin-top: 20px"
        :data="dialog_manage_tag.model.data"
        node-key="id"
        default-expand-all
        ref="tree"
        :filter-node-method="filterNode"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              style="margin-left: 10px"
              v-if="data.level === 1"
              type="text"
              size="mini"
              @click="() => openCreateLabelDialog('append', node, data)">
              <i class="el-icon-circle-plus-outline"></i>              
            </el-button>
						<el-button
              style="margin-left: 10px"
              type="text"
              size="mini"
              @click="() => openCreateLabelDialog('edit', node, data)">
              <i class="el-icon-edit"></i>              
            </el-button>
            <el-button
							v-if="data.children.length === 0"
              style="margin-left: 10px"
              type="text"
              size="mini"
              @click="() => removeLabel(node, data)">
              <i class="el-icon-delete"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog_manage_tag">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm_manage_tag" >确 定</el-button>
      </span>
    </el-dialog>
		<!-- 新增标签 -->
		<el-dialog
      v-if="dialog_add_tag.visible"
      :title="dialog_add_tag.title"
      :visible.sync="dialog_add_tag.visible"
      width="30%" center>
        <el-form  @submit.native.prevent class="demo-form-inline">
          <el-form-item label="标签级">
            <el-select v-model="dialog_add_tag.model.level" 
              :disabled="dialog_add_tag.type === 'new'" clearable placeholder="请选择" size="mini" style="width: 200px;">
              <el-option
                v-for="item in staticModel.addLabelLevel"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="添加到" v-if="dialog_add_tag.type === 'append'">
            <el-tag size="mini">{{dialog_add_tag.model.addTo}}</el-tag>
          </el-form-item>
          <el-form-item label="新标签名称">            
            <el-input 
              style="width: 200px"
              placeholder="新标签名称"
              size="mini"
              v-model.lazy="dialog_add_tag.model.labelName"
              @blur="query"
              clearable
            >
            </el-input>
          </el-form-item> 
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog_add_tag">取 消</el-button>
          <el-button type="primary" @click="dialogConfirm_add_tag" >确 定</el-button>
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
		.my-input {			
			-webkit-appearance: none;
			background-color: #fff;
			background-image: none;
			border-radius: 4px;
			border: 1px solid #dcdfe6;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			color: #606266;
			display: inline-block;				
			outline: 0;
			padding: 0 15px;
			-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
			transition: border-color .2s cubic-bezier(.645,.045,.355,1);
			width: 100%;
			&.mini {
				height: 28px;
				line-height: 28px;
				font-size: 12px;
			}
			&::-webkit-input-placeholder { /* WebKit, Blink, Edge */
				color: #bbb;
			}
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
				title: '',
				id: '',
				writerName: '',
				mainCategoryId: ''
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
			tagList: [], // 数据库标签列表
			staticModel: {
				categoryList: [],
				tagList: [],
				addLabelLevel: [
          { name: '一级', value: 1},
          { name: '二级', value: 2}
        ]
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
			},
			dialog_manage_tag : {
				type: '',
				title: '管理标签',
				visible: false,
				initData: {
					data: [],
					filterText: ''
				},
				model: {
					data: [],
					filterText: ''
				}
			},
			dialog_add_tag: {
				type: '', // 'new'：新建一级 'append'：追加
				title: '添加标签',
				visible: false,
				initData: {
					type: 'append',
					level: 2,
					labelName: '',
					addTo: '',
					currentData: {},
					currentNode: {}
				},
				model: {
					type: 'append',
					level: 2,
					labelName: '',
					addTo: '',
					currentData: {},
					currentNode: {}
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
		putData: function () {
			const { dialog = {} } = this
			const {model = {}} = dialog
			const {id, title, writers, coverUrl, country, abstract, tagIds, categoryIds, mainCategoryId} = model
      const putData = {id, title, writers, coverUrl, country, abstract, tagIds, categoryIds, mainCategoryId} 
      return putData
		}
	},
	watch: {
		'dialog_manage_tag.model.filterText' (val) {
      this.$refs.tree.filter(val)
		},
		tagList (val) {
      // console.log('watch labelList', val)
      // 将接口数据转换成树模型
			this.dialog_manage_tag.model.data = this.formatLabelTree(val)
			this.staticModel.tagList = this.formatSelectTagList(val)
    },
	},
	mounted () {
		this.search()
		this.queryAllCategorys()
		this.queryAllTags()		
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
		async queryAllCategorys () {
			try {
        const result = await request.literature.category.getAllCategorys ()  
				const {data} = result
				// console.log('data', data)
				if (data.success) {
					this.staticModel.categoryList = data.result.list
				}				
      } catch (err) {
				console.log(err)
				this.$message.error('获取标签列表失败!')
      }
    },	
		async queryAllTags () {
			try {
        const result = await request.literature.tag.getAllTags ()  
				const {data} = result
				// console.log('data', data)
				if (data.success) {
					this.tagList = data.result.list
				}				
      } catch (err) {
				console.log(err)
				this.$message.error('获取标签列表失败!')
      }
    },
		// 转化为选择器可选的标签，过滤掉一级标签
		formatSelectTagList (list) {
			return list.filter(v => {			
				return v.tagParentId
			})
		},
		handleCurrentChange () {
			this.query()
		},
		formatDate (row, column, cellValue) {
			return moment(new Date(cellValue)).format('lll')
		},
		pageToChapter (item) {
			console.log('pageToChapter', item)
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
			this.parseFetchData(item, this.dialog.model)
		},
		parseFetchData (item = {}, model) {
			const {Id, title, writers, coverUrl, country, abstract, tagIds = [], categoryIds = [], mainCategoryId} = item
			model.id = Id
			model.title = title
			model.writers = writers
			model.coverUrl = coverUrl
			model.country = country
			model.abstract = abstract
			model.tagIds = tagIds.map(v => v._id)
			model.categoryIds = categoryIds.map(v => v._id)
			model.mainCategoryId = mainCategoryId._id
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
				this.editArticle()
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
		editArticle () {
			this.http_edit_article(() => {
				this.$message({
					showClose: true,
					message: '修改文章成功',
					type: 'success'
				})
				this.query()
				this.closeDialog()
			}, err => {
				this.$message.error(err || '修改文章失败')
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
		async http_edit_article (sucNext, failNext) {
			const putData = this.putData
			console.log('putData', putData)
			// return
			this.http_update_article(putData, sucNext, failNext)  
		},
		async http_update_article (data, sucNext, failNext) {
			const {id, ...rest} = data
			const putData = {id, ...rest}
			try {
        const result = await request.literature.article.updateArticle(putData) 
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
		},
		// 标签相关
		openManageTagDialog () {
			this.dialog_manage_tag.visible = true			
		},
		formatLabelTree (list = []) {
      const result = []
      list.forEach(v => {
        if (!v.tagParentId) {
          const parentLabel = {
            id: v.Id,
            level: 1,
            label: v.tagname,
            children: []
          }
          result.push(parentLabel)
        }
      })
      result.forEach(k => {
        list.forEach(j => {
          if (j.tagParentId === k.id) {
            const label = {
              id: j.Id,
              level: 2,
              label: j.tagname,
              children: []
            }
            k.children.push(label)
          }
        })
      })
      return result
    },		
		// 过滤树节点
    filterNode (value, data, node) {
      if (!value) return true
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      if (node.parent.data.label && node.parent.data.label.indexOf(value) !== -1) {
        return true
      }
      return false
		},
		// 添加标签对话框
    openCreateLabelDialog (type, node, data) {
      this.dialog_add_tag.visible = true
      this.dialog_add_tag.model = util.deepClone(this.dialog_add_tag.initData)
      this.dialog_add_tag.type = type
      console.log('openCreateLabelDialog', data)
      if (type === 'new') {
				this.dialog_add_tag.title = '新增标签'
        this.dialog_add_tag.model.level = 1
        this.dialog_add_tag.addTo = ''
      } else if (type === 'append') {
				this.dialog_add_tag.title = '新增标签'
        this.dialog_add_tag.model.currentData = data
        this.dialog_add_tag.model.currentNode = node
        this.dialog_add_tag.model.level = 2
        this.dialog_add_tag.model.addTo = data.label
      } else if (type === 'edit') {
				console.log('openCreateLabelDialog', data)
				this.dialog_add_tag.title = '编辑标签'
				this.dialog_add_tag.model.currentData = data
        this.dialog_add_tag.model.currentNode = node
        this.dialog_add_tag.model.labelName = data.label
			}
    },		
		closeDialog_manage_tag () {
      this.dialog_manage_tag.visible = false
		},
		dialogConfirm_manage_tag () {
			this.closeDialog_manage_tag()
		},
		closeDialog_add_tag () {
			this.dialog_add_tag.visible = false
		},
		dialogConfirm_add_tag () {
			if (this.dialog_add_tag.type === 'new') {
        this.appendLabel(this.dialog_add_tag.model.level, this.dialog_add_tag.model.data, this.dialog_add_tag.model.labelName)
      } else if (this.dialog_add_tag.type === 'append') {
        this.appendLabel(this.dialog_add_tag.model.level, this.dialog_add_tag.model.currentData, this.dialog_add_tag.model.labelName)
      } else if (this.dialog_add_tag.type === 'edit') {        
				this.updateLabel(this.dialog_add_tag.model.currentData, this.dialog_add_tag.model.labelName)
			}
		},
		/**
     * level 标签级别
     * data 添加到的父元素
     * labelName 添加的标签名
     */
    appendLabel (level, data, labelName) {
      // tagParentId tagId tagName
      let postData = {}
      if (level === 1) {
        postData = {tagname: labelName}
      } else if (level === 2) {
        postData = {tagParentId: data.id, tagname: labelName}
			}
			console.log('postData', postData)
			this.http_create_tag(postData, () => {
				this.$message({
					showClose: true,
					message: '创建标签成功',
					type: 'success'
				})
				this.queryAllTags()
				this.closeDialog_add_tag()
			}, err => {
				this.$message.error(err || '创建标签失败')
			})
		},
		async http_create_tag (postData, sucNext, failNext) {	
			// console.log('postData', postData)
			try {
        const result = await request.literature.tag.createTag(postData) 
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
		updateLabel (data, labelName) {
      const putData = {id: data.id, tagname: labelName}			
			this.http_update_tag(putData, () => {
				this.$message({
					showClose: true,
					message: '编辑标签成功',
					type: 'success'
				})
				this.queryAllTags()
				this.closeDialog_add_tag()
			}, err => {
				this.$message.error(err || '编辑标签失败')
			})
		},
		async http_update_tag (putData, sucNext, failNext) {	
			try {
        const result = await request.literature.tag.updateTag(putData) 
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
		// 删除树节点
    removeLabel (node, data) {
			// console.log('remove', node, data)
			const putData = {id: data.id, delete: 1}
      this.$confirm('确认删除该标签吗？').then(() => {
				this.http_delete_tag(putData, () => {
					this.$message({
						showClose: true,
						message: '删除标签成功',
						type: 'success'
					})
					this.queryAllTags()
					this.closeDialog_add_tag()
				}, err => {
					this.$message.error(err || '删除标签失败')
				})
      }).catch(() => {})
		},
		async http_delete_tag (putData, sucNext, failNext) {
			this.http_update_tag(putData, sucNext, failNext)  
		}
  }
}
</script>