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
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Type">
				<span class="wrapper">
    				<el-button :plain="true" type="success" @click='sel1'>Jvm</el-button>
    				<el-button :plain="true" type="success" @click='sel2'>Blackbox</el-button>
  			</span>
				</el-form-item>
				<div class='jvm' v-show='show'>
					<el-collapse v-model="activeName" accordion>
						<el-collapse-item title="一致性 Consistency" name="1">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
						<el-collapse-item title="反馈 Feedback" name="2">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
						<el-collapse-item title="效率 Efficiency" name="3">
							<div>1</div>
							<div>2</div>
							<div>3</div>
						</el-collapse-item>
						<el-collapse-item title="可控 Controllability" name="4">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
						<el-collapse-item title="一致性 Consistency" name="5">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
						<el-collapse-item title="反馈 Feedback" name="6">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
						<el-collapse-item title="反馈 Feedback" name="7">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
						<el-collapse-item title="反馈 Feedback" name="8">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
					</el-collapse>
				</div>
				<div class='blackbox' v-show='hide'>
					<el-collapse v-model="activeName" accordion>
						<el-collapse-item title="一致性 Consistency" name="1">
							<div>11</div>
							<div>2</div>
						</el-collapse-item>
						<el-collapse-item title="反馈 Feedback" name="2">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
						<el-collapse-item title="效率 Efficiency" name="3">
							<div>1</div>
							<div>2</div>
							<div>3</div>
						</el-collapse-item>
						<el-collapse-item title="可控 Controllability" name="4">
							<div>1</div>
							<div>2</div>
						</el-collapse-item>
					</el-collapse>
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
        activeName: '1',
				show:false,
				hide:true,
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

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
				}

			}
		},
		methods: {
      sel1(){
        this.show=!false;
        this.hide=false;
      },
      sel2(){
        this.show=false;
        this.hide=true;
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
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
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
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>
	.jvm{
		height: 300px;
		margin-left: 40px;
	}
	.blackbox{
		height:300px;
		margin-left: 40px;
	}
</style>