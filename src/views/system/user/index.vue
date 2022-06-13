<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>系统用户</span>
				<el-button @click="$refs['AddUserDialog'].open()" type="primary" class="drift-right">添加用户</el-button>
				<el-button @click="$refs['FormDrawer'].open()" type="primary" class="drift-right">打开查询表单</el-button>
			</div>
			<el-table
				ref="TableDom"
				:data="tableData"
				v-loading="tableLoading"
				show-overflow-tooltip
				tooltip-effect="dark"
				:header-cell-style="{ textAlign: 'center', 'background-color': '#f9f9f9', color: '#333333' }"
				:cell-style="{ textAlign: 'center' }"
			>
				<el-table-column label="用户名" prop="username" min-width="160"></el-table-column>
				<el-table-column label="真实姓名" prop="realName" min-width="120"></el-table-column>
				<el-table-column label="创建时间" prop="createTime" min-width="160"></el-table-column>
				<el-table-column label="部门ID" prop="deptId" min-width="120"></el-table-column>
				<el-table-column label="部门名称" prop="deptName" min-width="120"></el-table-column>
				<el-table-column label="邮箱" prop="email" min-width="200"></el-table-column>
				<el-table-column label="身份证号" prop="idNumber" min-width="200"></el-table-column>
				<el-table-column label="最近访问时间" prop="lastLoginTime" min-width="160"></el-table-column>
				<el-table-column label="联系电话" prop="mobile" min-width="120"></el-table-column>
				<el-table-column label="角色ID" prop="roleId" min-width="120"></el-table-column>
				<el-table-column label="性别" prop="sex" min-width="120" :formatter="row => getItemLabel(selectSex, row.sex)"></el-table-column>
				<el-table-column label="状态" prop="status" min-width="120" :formatter="row => getItemLabel(selectStatus, row.status)"></el-table-column>
				<el-table-column label="是否开启tab" prop="tab" min-width="120"></el-table-column>
				<el-table-column label="操作" min-width="180" :fixed="tableData.length > 0 ? 'right' : false">
					<template v-slot="{ row }">
						<el-link type="warning" @click="updateRow(row)">修改用户</el-link>
						<el-link type="danger" @click="deleteRow(row.id)">删除</el-link>
					</template>
				</el-table-column>
				<el-empty description="暂无数据" slot="empty"><el-button type="primary" @click="startGetTableData()">尝试获取</el-button></el-empty>
			</el-table>
			<TablePagination
				:total="tableQueryOption.total"
				:current="tableQueryOption.current"
				@currentChange="
					val => {
						tableQueryOption.current = val;
						getTableData();
					}
				"
				@sizeChange="
					val => {
						tableQueryOption.size = val;
						getTableData();
					}
				"
			/>
		</el-card>
		<AddUserDialog ref="AddUserDialog" :selectRole="selectRole" @success="startGetTableData"></AddUserDialog>
		<UpdateUserDialog ref="UpdateUserDialog" :selectRole="selectRole" @success="startGetTableData"></UpdateUserDialog>
		<FormDrawer ref="FormDrawer" size="400px" title="查询表单" @submit="submit" @success="startGetTableData" @closed="emptyForm">
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
				<!--
					deptId: '', //	部门ID	query	false	integer(int32)
				-->
				{{ Form }}
				<el-form-item prop="username" label="操作用户"><el-input v-model="Form.username" /></el-form-item>
				<el-form-item prop="idNumber" label="身份证号"><el-input v-model="Form.idNumber" /></el-form-item>
				<el-form-item prop="mobile" label="联系电话"><el-input v-model="Form.mobile" /></el-form-item>
				<el-form-item prop="realName" label="真实姓名"><el-input v-model="Form.realName" /></el-form-item>
				<el-form-item prop="email" label="邮箱">
					<!-- <el-autocomplete v-model="Form.email" :trigger-on-focus="false" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete> -->
					<FormEmailInput v-model="Form.email"></FormEmailInput>
				</el-form-item>

				<el-form-item prop="roleId" label="角色">
					<el-select v-model="Form.roleId"><el-option v-for="item in selectRole" :key="item.value" :value="item.value" :label="item.label"></el-option></el-select>
				</el-form-item>
				<el-form-item prop="sex" label="性别">
					<el-select v-model="Form.sex"><el-option v-for="item in selectSex" :key="item.value" :value="item.value" :label="item.label"></el-option></el-select>
				</el-form-item>
				<el-form-item prop="status" label="用户状态">
					<el-select v-model="Form.status"><el-option v-for="item in selectStatus" :key="item.value" :value="item.value" :label="item.label"></el-option></el-select>
				</el-form-item>
				<el-form-item prop="lastLoginTime" label="最近访问时间">
					<el-date-picker v-model="Form.lastLoginTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item prop="createTimeFrom" label="开始时间">
					<el-date-picker
						v-model="Form.createTimeFrom"
						:picker-options="pickerOptionsStart"
						value-format="yyyy-MM-dd"
						type="date"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
				<el-form-item prop="createTimeTo" label="结束时间">
					<el-date-picker
						v-model="Form.createTimeTo"
						:picker-options="pickerOptionsEnd"
						value-format="yyyy-MM-dd"
						type="date"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="success" @click="exportToExcel">导出表格</el-button>
				<el-button type="warning" @click="emptyForm('Form')">重置</el-button>
			</template>
		</FormDrawer>
	</el-row>
</template>
<script>
import ApiUser from '@/api/system/user.js';
import ApiRole from '@/api/system/role.js';

import FormUtil from '@/utils/formUtil.js';
import $_Confirm from '@/utils/confirm.js';

import AddUserDialog from './components/AddUserDialog.vue';
import UpdateUserDialog from './components/UpdateUserDialog.vue';

import FormEmailInput from '@/components/FormEmailInput/index.vue';
import FormDrawer from '@/components/FormDrawer/index.vue';
import TablePagination from '@/components/TablePagination/index.vue';
export default {
	data() {
		return {
			FormUtil: FormUtil,
			tableLoading: false,
			tableData: [],
			tableQueryOption: {
				size: 10,
				current: 1,
				total: 0
			},
			Form: {
				createTimeFrom: '', //	起始时间	query	false	string
				createTimeTo: '', //	截止时间	query	false	string
				deptId: '', //	部门ID	query	false	integer(int32)
				email: '', //	邮箱	query	false	string
				idNumber: '', //	身份证号	query	false string
				lastLoginTime: '', //	最近访问时间	query	false	string
				mobile: '', //	联系电话	query	false	string
				password: '', //	密码	query	false	string
				realName: '', //	真实姓名	query	false	string
				roleId: '', //	角色ID	query	false	string
				sex: '', //	0=男,1=女,2=保密	query	false	string
				status: '', //	0=锁定,1=有效	query	false	string
				username: '' //	用户名	query	false	string'
				// field:"",//	排序字段	query	false	string
				// order:"",//	排序规则，asc升序，desc降序	query	false	string
			},
			Rules: {
				// username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
			},
			pickerOptionsStart: {
				disabledDate: time => {
					if (this.Form.createTimeTo) {
						// 开始时间
						return time.getTime() > new Date(this.Form.createTimeTo).getTime();
					}
				}
			},
			pickerOptionsEnd: {
				disabledDate: time => {
					if (this.Form.createTimeFrom) {
						// 开始时间
						return time.getTime() < new Date(this.Form.createTimeFrom).getTime();
					}
				}
			},
			selectSex: [{ value: '0', label: '男' }, { value: '1', label: '女' }, { value: '2', label: '保密' }],
			selectStatus: [{ value: '0', label: '锁定' }, { value: '1', label: '有效' }],
			selectRole: []
		};
	},
	components: {
		FormEmailInput,
		FormDrawer,
		TablePagination,
		AddUserDialog,
		UpdateUserDialog
	},
	computed: {},
	mounted() {
		this.init();
	},
	methods: {
		getItemLabel: FormUtil.getItemLabel,
		startGetTableData() {
			this.tableQueryOption.current = 1;
			this.getTableData();
		},
		init() {
			this.getTableData();
			this.getAllRoles();
		},
		async getAllRoles() {
			let { code, data } = await ApiRole.getAllRoles();
			if (code == 10200) {
				this.selectRole = data.map(item => {
					return {
						value: item.id,
						label: item.roleName
					};
				});
			}
		},
		submit() {
			this.validateForm('Form').then(res => {
				this.$refs['FormDrawer'].closeDrawer();
			});
		},
		async fliterFrom() {
			let form = await FormUtil.filterHasValue(this.Form);
			let options = await FormUtil.excludeAttr(this.tableQueryOption, 'total');
			let params = {
				...form,
				...options
			};
			return params;
		},
		async getTableData() {
			this.tableLoading = true;
			let params = await this.fliterFrom();
			console.log(params);
			let { code, data, msg } = await ApiUser.selectUserList(params).finally(() => {
				this.tableLoading = false;
			});
			if (code == 10200) {
				// let records = data.records.map(item=>{
				// 	item.sex = FormUtil.getItem(this.selectSex, item.sex).label;
				// 	item.status = FormUtil.getItem(this.selectStatus, item.status).label;
				// 	return item
				// })
				this.tableData = data.records;
				this.tableQueryOption.total = data.total;
				console.log(this.tableData);
			}
			this.tableLoading = false;
		},
		async exportToExcel() {
			let params = await this.fliterFrom();
			ApiUser.exportUserToExcel(params);
		},
		updateRow(row) {
			this.$refs['UpdateUserDialog'].open(row);
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await ApiUser.deleteUserByIds(ids);
					if (code == 10200) {
						this.tableQueryOption.current = 1;
						this.getTableData();
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
