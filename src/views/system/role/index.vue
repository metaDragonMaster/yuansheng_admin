<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>用户权限</span>
				<!-- <el-button @click="getLoginLogOfCurrentUser" type="primary" class="drift-right">展示本人记录</el-button> -->
				<el-button @click="$refs['AddRoleDialog'].open()" type="success" class="drift-right">添加用户</el-button>
				<el-button @click="$refs['FormDrawer'].open()" type="primary" class="drift-right">打开查询表单</el-button>
			</div>
			<el-table
				ref="TableDom"
				v-loading="tableLoading"
				:data="tableData"
				show-overflow-tooltip
				tooltip-effect="dark"
				:header-cell-style="{ textAlign: 'center', 'background-color': '#f9f9f9', color: '#333333' }"
				:cell-style="{ textAlign: 'center' }"
			>
				<el-table-column label="角色名称" prop="roleName" min-width="120"></el-table-column>
				<el-table-column label="角色权限" prop="remark" min-width="120"></el-table-column>
				<el-table-column label="修改时间" prop="modifyTime" min-width="120"></el-table-column>
				<el-table-column label="创建时间" prop="createTime" min-width="120"></el-table-column>
				<el-table-column label="菜单列表" prop="menuIds" min-width="120">
					<template v-slot="{ row }">
						<el-link type="primary" class="pointer" @click="updataRowRoleById(row)" slot="reference">
							菜单权限
						</el-link>
					</template>
				</el-table-column>
				<el-table-column label="操作"  :fixed="tableData.length > 0?'right':false" >
					<template v-slot="{ row }">
						<el-link type="warning" @click="updateRow(row)">修改</el-link>
						<el-link type="danger" @click="deleteRow(row.id)">删除</el-link>
					</template>
				</el-table-column>
				<el-empty description="暂无数据" slot="empty"><el-button type="primary" @click="getTableData()">尝试获取</el-button></el-empty>
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
		<AddRoleDialog ref="AddRoleDialog" @success="startGetTableData"></AddRoleDialog>
		<UpdateRoleDialog ref="UpdateRoleDialog" @success="startGetTableData"></UpdateRoleDialog>
		<UpdateRolePermissDialog ref="UpdateRolePermissDialog" @success="startGetTableData" :menuTree="menuTree"></UpdateRolePermissDialog>
		<FormDrawer ref="FormDrawer" size="372px" title="查询表单" @submit="submit" @success="startGetTableData" @closed="emptyForm">
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
				<el-form-item prop="roleName" label="角色名称">
					<el-input v-model="Form.roleName"></el-input>
				<!-- 	<el-select v-model="Form.roleName" filterable >
						<el-option v-for="item in selectRole" :key="item.value" :label="item.label" :value="item.label"></el-option>
					</el-select> -->
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
				<el-button type="warning" @click="emptyForm(formName)">重置表单</el-button>
			</template>
		</FormDrawer>
	</el-row>
</template>
<script>
import ApiRole from '@/api/system/role.js';
import ApiMenu from '@/api/system/menu.js';

import FormUtil from '@/utils/formUtil.js';
import $_Confirm from '@/utils/confirm.js';

import FormDrawer from '@/components/FormDrawer/index.vue';
// import FormDialog from '@/components/FormDialog/index.vue';
import TablePagination from '@/components/TablePagination/index.vue';
import AddRoleDialog from './components/AddRoleDialog.vue';
import UpdateRoleDialog from './components/UpdateRoleDialog.vue';
import UpdateRolePermissDialog from './components/UpdateRolePermissDialog.vue';

export default {
	data() {
		return {
			tableLoading: false,
			tableData: [],
			tableQueryOption: {
				size: 10,
				current: 1,
				total: 0
			},
			Form: {
				roleName: '',
				createTimeFrom: '',
				createTimeTo: ''
			},
			Rules: {
				// userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
			},
			// FormUtil: FormUtil,
			// selectRole: []
			menuTree:[],
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
		};
	},
	components: {
		FormDrawer,
		TablePagination,
		// FormDialog,
		AddRoleDialog,
		UpdateRoleDialog,
		UpdateRolePermissDialog,
	},
	mounted() {
		this.init();
	},
	methods: {
		startGetTableData() {
			this.tableQueryOption.current = 1;
			this.getTableData();
		},
		init() {
			this.getTableData();
			this.getMenuTree()
			// this.getAllRoles();
		},
		// async getAllRoles() {
		// 	let { code, data } = await ApiRole.getAllRoles();
		// 	if (code == 10200) {
		// 		this.selectRole = data.map(item => {
		// 			return {
		// 				value: item.id,
		// 				label: item.roleName
		// 			};
		// 		});
		// 	}
		// },
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
			let { code, data, msg } = await ApiRole.selectRoleList(params).finally(()=>{
				this.tableLoading = false;
			});
			if (code == 10200) {
				this.tableData = data.records;
				this.tableQueryOption.total = data.total;
			}
			this.tableLoading = false;
		},
		async exportToExcel() {
			let params = await this.fliterFrom();
			ApiRole.exportRoleToExcel(params);
		},
		updateRow(row) {
			this.$refs['UpdateRoleDialog'].open(row);
		},
		updataRowRoleById(row) {
			this.$refs['UpdateRolePermissDialog'].open(row);
		},
		deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await ApiRole.deleteRoleById(ids);
					if (code == 10200) {
						this.tableQueryOption.current = 1;
						this.getTableData();
					}
				}
			});
		},
		// 查询菜单树
		async getMenuTree() {
			let tree = await ApiMenu.selectMenuList();
			// 防止过滤后变量污染
			console.log(tree);
			// let jsonTreeData = JSON.stringify(tree.data);
			this.menuTree = tree.data;
		},
	}
};
</script>
<style lang="scss" scoped="scoped">
.pointer {
	cursor: pointer;
}
</style>
