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
			<el-table-column prop="index" type="index" label="序号" width="110" sortable>
			</el-table-column>
			<el-table-column prop="name" label="标题" width="470" sortable>
			</el-table-column>
			<el-table-column prop="tag" label="Type" width="400" :formatter="formatType" :filters="[{ text: 'Jvm', value: 0 }, { text: 'Blackbox', value: 1 }]" :filter-method="filterTag" filter-placement="">
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
				<el-form-item label="Type">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">Jvm</el-radio>
						<el-radio class="radio" :label="0">Blackbox</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增配置" v-model="addFormVisible" :close-on-click-modal="true" >
			<el-form :model="addForm" label-width="50px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题:" prop="title">
					<el-input v-model="addForm.name" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="TYPE:">
				<span class="wrapper">
    				<el-button :plain="or1" type="success" @click='sel1'>Jvm</el-button>
    				<el-button :plain="or2" type="success" @click='sel2'>Blackbox</el-button>
  			</span>
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
					<el-button type="primary" class='add' size="mini" @click='addDomain'>增加一条static配置信息</el-button>
					<div class='tar'>
						<el-form v-for="(domain, index) in dynamicValidateForm.domains" :model="dynamicValidateForm" id='more' style='margin-left: 4px;' ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
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
									<br>
									<input type="button" value='targets:' disabled style='width: 60px;font-size: 14px'>
									<input type="text" id='addurl' style='margin-bottom: 10px;' placeholder='请输入IP地址+端口信息'>
									<em class='addurl' @click="addurl">+</em>
									<br>
									<ul id='list'></ul>
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
					<el-button type="primary" class='add' style='top: 185px;left: 130px;' size="mini" @click='addDomain'>增加一条static配置信息</el-button>
					<div class='tar'>
						<el-form v-for="(domain, index) in dynamicValidateForm.domains" :model="dynamicValidateForm" id='more' style='margin-left: 4px;' ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
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
									<br>
									<input type="button" value='targets:' disabled style='width: 60px;font-size: 14px'>
									<input type="text" id='addurl' style='margin-bottom: 10px;' placeholder='请输入IP地址+端口信息'>
									<em class='addurl' @click="addurl">+</em>
									<br>
									<ul id='list'></ul>
								</el-collapse-item>
							</el-collapse>
						</el-form>
					</div>
				</div>
				
				
				
			</el-form>
			<div slot="footer" class="dialog-footer">
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
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				//dynamicValidateForm: {
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
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
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
   
			//重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
			//删除
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
			//新增
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      },
			
			//添加url地址
      addurl(){
        var li = document.createElement('li');
        li.innerText = document.querySelector('#addurl').value;
        document.querySelector('#list').appendChild(li);
        document.querySelector('#addurl').value='';
        var button = document.createElement('button');
        button.innerHTML='删除';
        li.appendChild(button);
        button.style.marginLeft='30px';
        button.style.color='red';
        button.style.border='none';
        button.style.backgroundColor='#fff';
        button.style.cursor='pointer';
				button.onclick=function () {
					var parent = this.parentNode;
					parent.innerHTML=''
        }
      },
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
		/*margin-left: 3px;*/
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
	em{
		display: inline-block;
		width: 30px;
		height: 30px;
		cursor: pointer;
		margin-left: 10px;
		font-size: 20px;
	}
	em:hover{
		color: #11b95c;
	}
	.add{
		position: absolute;
		left: 120px;
		top: 105px;
	}
	ul li .del{
		display: inline-block;
		font-size: 10px;
		width: 30px;
		padding: 2px;
		margin-left: 30px;
		cursor: pointer;
		color: red;
	}
	.el-table-filter{
		left: 300px;
	}
</style>