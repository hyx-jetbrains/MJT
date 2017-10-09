<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">标题查询</el-button>
				</el-form-item>
				<div class="block">
					<el-date-picker
							format='yyyy-MM-dd HH:mm:ss'
							v-model="value3"
							type="datetimerange"
							placeholder="选择时间范围">
					</el-date-picker>
					<el-button type="primary" @click="gettimedata" class='timebtn'>时间查询</el-button>
				</div>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%">
			<!--单选框-->
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!--<el-table-column prop="index" type="index" label="序号" width="110" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="time" label="告警时间" width="195" sortable>
			</el-table-column>
			<el-table-column prop="name" label="告警标题" width="500">
			</el-table-column>
			<el-table-column prop="tag" label="告警状态" width="160" :formatter="formatType" :filters="[{ text: 'Jvm', value: 0 }, { text: 'Blackbox', value: 1 }]" :filter-method="filterTag" filter-placement="">
				<template scope="scope">
					<el-tag
							:type="scope.row.tag === 0 ? 'primary' : 'success'"
							close-transition>{{scope.row.tag}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="tag" label="告警类型" width="160" :formatter="formatType" :filters="[{ text: 'Jvm', value: 0 }, { text: 'Blackbox', value: 1 }]" :filter-method="filterTag" filter-placement="">
				<template scope="scope">
					<el-tag
							:type="scope.row.tag === 0 ? 'primary' : 'success'"
							close-transition>{{scope.row.tag}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">详细信息</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--查看界面-->
		<el-dialog title="详细信息" v-model="editFormVisible" :close-on-click-modal="false" class='tc'>
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题：" prop="title">
					{{editForm.name}}
				</el-form-item>
				<el-form-item label="时间：" prop="time">
					{{editForm.time}}
				</el-form-item>
				<el-form-item label="状态：" prop="status">
					{{editForm.status}}
				</el-form-item>
				<el-form-item label="类型：" prop="status">
					jvm
				</el-form-item>
				<!--jvm-->
				<div class='jvm'>
					<span>job_name:</span>
					<el-input placeholder="请输入内容" v-model="jvm1"></el-input>
					<br>
					<span>metrics_path:</span>
					<el-input placeholder="请输入内容" v-model="jvm2"></el-input>
					<br>
					<span style='margin-bottom: 10px;'>static_configs:</span><br>
					<el-button type="primary" class='add' size="mini" @click='addDomain1'>增加一条static配置信息</el-button>
					<div class='tar'>
						<el-form v-for="(domain, index) in dynamicValidateForm.domains1" :model="dynamicValidateForm" style='margin-left: 4px;' ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
							<el-collapse v-model="activeNames"  @change="">
								<el-collapse-item title="配置static_configs" name="1">
									<select>
										<option value="env" style="color: #b6b6b6" disabled selected>env</option>
										<option value="prod1">prod1</option>
										<option value="prod2">prod2</option>
										<option value="prod3">prod3</option>
										<option value="prod4">prod4</option>
									</select>
									<select>
										<option value="env" style="color: #b6b6b6" disabled selected>system</option>
										<option value="bloan-rcpm1">bloan-rcpm1</option>
										<option value="bloan-rcpm2">bloan-rcpm2</option>
										<option value="bloan-rcpm3">bloan-rcpm3</option>
										<option value="bloan-rcpm4">bloan-rcpm4</option>
									</select>
									<select>
										<option value="env" style="color: #b6b6b6" disabled selected>component</option>
										<option value="prod1">prod1</option>
										<option value="prod2">prod2</option>
										<option value="prod3">prod3</option>
										<option value="prod4">prod4</option>
									</select>
									<select style='margin-bottom:5px;'>
										<option value="env" style="color: #b6b6b6" disabled selected>type</option>
										<option value="prod1">prod1</option>
										<option value="prod2">prod2</option>
										<option value="prod3">prod3</option>
										<option value="prod4">prod4</option>
									</select>
								</el-collapse-item>
							</el-collapse>
						</el-form>
					</div>
				</div>
				
				<!--blackbox-->
				<div class='blackbox jvm'>
					<span style='margin-right: 15px;'>job_name:</span>
					<el-input placeholder="请输入内容" v-model="jvm11"></el-input>
					<br>
					<span style='margin-right: 15px;'>scrape_interval:</span>
					<el-input placeholder="请输入内容" v-model="jvm22"></el-input>
					<br>
					<span style='margin-right: 15px;'>metrics_path:</span>
					<el-input placeholder="请输入内容" v-model="jvm33"></el-input>
					<br>
					<span style='margin-right: 15px;'>params:</span>
					<el-select v-model="value" placeholder="module">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
					<br>
					<span style='margin-bottom: 10px;'>static_configs:</span><br>
					<el-button type="primary" class='add' style='top: 185px;left: 130px;' size="mini" @click='addDomain2'>增加一条static配置信息</el-button>
					<div class='tar'>
						<el-form v-for="(domain, index) in dynamicValidateForm.domains2" :model="dynamicValidateForm" id='more' style='margin-left: 4px;' ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
							<el-collapse v-model="activeNames" id='clone' @change="handleChange">
								<el-collapse-item title="配置static_configs" name="1">
									<select>
										<option value="env" style="color: #b6b6b6" disabled selected>env</option>
										<option value="prod1">prod1</option>
										<option value="prod2">prod2</option>
										<option value="prod3">prod3</option>
										<option value="prod4">prod4</option>
									</select>
									<select>
										<option value="env" style="color: #b6b6b6" disabled selected>system</option>
										<option value="bloan-rcpm1">bloan-rcpm1</option>
										<option value="bloan-rcpm2">bloan-rcpm2</option>
										<option value="bloan-rcpm3">bloan-rcpm3</option>
										<option value="bloan-rcpm4">bloan-rcpm4</option>
									</select>
									<select>
										<option value="env" style="color: #b6b6b6" disabled selected>component</option>
										<option value="prod1">prod1</option>
										<option value="prod2">prod2</option>
										<option value="prod3">prod3</option>
										<option value="prod4">prod4</option>
									</select>
									<select style='margin-bottom:5px;'>
										<option value="env" style="color: #b6b6b6" disabled selected>type</option>
										<option value="prod1">prod1</option>
										<option value="prod2">prod2</option>
										<option value="prod3">prod3</option>
										<option value="prod4">prod4</option>
									</select>
								</el-collapse-item>
							</el-collapse>
						</el-form>
					</div>
				</div>
				
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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
				
        value3: '',
				
				
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
      gettimedata(){
        alert(this.value3)
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
	.block{
		margin-left: 20px;
		display: inline-block;
	}
	.timebtn{
		margin-left: 10px;
	}
</style>