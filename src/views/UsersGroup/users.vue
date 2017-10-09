<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users"   highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!--单选框-->
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="index" type="index" label="序号" width="80" sortable>
			</el-table-column>
			<el-table-column prop="name" label="规则" width="470" sortable>
			</el-table-column>
			<el-table-column prop="cname" label="收件人" width="120" sortable>
			</el-table-column>
			<el-table-column prop="cname" label="排除时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="tag" label="频率" width="150" :formatter="formatType" :filters="[{ text: 'Jvm', value: 0 }, { text: 'Blackbox', value: 1 }]" :filter-method="filterTag" filter-placement="">
				<template scope="scope">
					<el-tag
							:type="scope.row.tag === 0 ? 'primary' : 'success'"
							close-transition>{{scope.row.tag}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" class='tc'>
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增规则" v-model="addFormVisible" :close-on-click-modal="true" >
			<el-form :model="addForm" label-width="50px" :rules="addFormRules" ref="addForm">
				<el-form-item label="规则:" prop="title">
					<el-input v-model="addForm.name" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="频率:" prop="title">
					<el-input v-model="addForm.name" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="" prop="title" style='width: 100px !important;'>
					<el-input v-model="addForm.name" auto-complete="on"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = true">比对</el-button>
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					title: ''
				},
				or1:true,
				or2:true,
        activeName: '1',
        activeNames:'',
				show:false,
				hide:true,
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				
				jvm1:'rcpm-common-jvm',
        jvm2:'/bloan_common/metrics',
        jvm3:'',
        
        jvm11:'bloan-telnet',
        jvm22:'30s',
        jvm33:'/probe',
        
        
        options: [{
          value: '选项1',
          label: 'port_check'
        }, {
          value: '选项2',
          label: 'port_check2'
        }, {
          value: '选项3',
          label: 'port_check3'
        }, {
          value: '选项4',
          label: 'port_check4'
        }, {
          value: '选项5',
          label: 'port_check5'
        }],
        value: '',
        
        blackbox1:'bloan-telnet',
        blackbox2:'30s',
        blackbox3:'/probe',
        blackbox4:'[port_check]',
        blackbox5:'',
				
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
        
        //编辑器设置
        editorOption: {
          modules: {
            toolbar: ['code-block']
          }
				},
				
				//编辑界面数据
				editForm: {
					id: 0,
					name: ''
				},
				//dynamicValidateForm: {
        dynamicValidateForm: {
          domains1: [{
            value: ''
          }],
          domains2: [{
            value: ''
          }],
          domains3: [{
            value: ''
          }]
        },
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: ''
				},
        
        form: {
          user: '1',
          region: 'env'
        },
        form: {
          user: '2',
          region: 'system'
        },
        form: {
          user: '3',
          region: '3'
        },
        form: {
          user: '4',
          region: '4'
        }

			}
		},
		methods: {
      handleChange(){
      
			},
      content(){
      
			},
      sel1(){
        this.or1=false;
        this.or2=!false;
        
        document.getElementsByClassName('jvm')[0].style.display='block';
        document.getElementsByClassName('blackbox')[0].style.display='none';
      },
      sel2(){
        this.or1=!false;
        this.or2=false;
  
        document.getElementsByClassName('jvm')[0].style.display='none';
        document.getElementsByClassName('blackbox')[0].style.display='block';
      },
      filterTag(value, row) {
        return row.tag === value;
      },
			//性别type类型转换
			formatType: function (row, column) {
				return row.tag == 1 ? 'Jvm' : row.tag == 0 ? 'Blackbox' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
        this.or1 = true;
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
        this.show=false;
        this.hide=true;
				this.addFormVisible = true;
				this.addForm = {
					name: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			
			//删除
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains3.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains3.splice(index, 1)
        }
      },
			//新增
      addDomain1() {
        this.dynamicValidateForm.domains1.push({
          value: '1',
          key: Date.now()
        });
      },
      addDomain2() {
        this.dynamicValidateForm.domains2.push({
          value: '',
          key: Date.now()
        });
      },
      addDomain3() {
        this.dynamicValidateForm.domains3.push({
          value: '',
          key: Date.now()
        });
      }
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>
	*{
		list-style: none;
	}
	ul{
		margin: 0;
		margin-left: -30px;
	}
	.jvm{
		width: 590px;
		position: relative;
		left: 50%;
		transform: translateX(-47.5%);
		display: none;
		border: 1px solid #dddddd;
		padding: 10px;
	}
	.blackbox{
		width: 590px;
		position: relative;
		left: 50%;
		transform: translateX(-47.5%);
		display: none;
		border: 1px solid #dddddd;
		padding: 10px;
	}
	.el-input{
		width: 300px;
		margin-bottom: 5px;
	}
	.el-input template{
		width: 200px;
	}
	.jvm span{
		display: inline-block;
		width: 100px;
		font-size: 16px;
		margin-top: 10px;
	}
	.tar{
		margin-left: -4px;
	}
	.new{
		position: relative;
		top: -55px;
	}
	.labels{
		margin-left: 22px;
		margin-bottom: 10px;
		display: inline-block;
	}
	.tar span{
		font-size: 14px;
	}
	i{
		font-style: normal;
		color: red;
	}
	input{
		width: 200px;
	}
	.add{
		position: absolute;
		left: 120px;
		top: 105px;
	}
	.yuming{
		font-size: 12px;
	}
	.el-form-item.is-required{
		margin-bottom: 2px;
		font-size: 12px;
	}
	.addym{
		font-size: 14px;
		margin-left: -90px;
		padding: 5px;
	}
	.static_configs{
		margin-bottom: 30px;
	}
	.remove_static_configs{
		font-size: 12px;
		position: absolute;
		left: 200px;
		top: 7px;
		border: none;
	}
</style>