<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>系统日志</span>
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
				<el-table-column label="创建时间" prop="createTime" min-width="120"></el-table-column>
				<el-table-column label="IP地址" prop="ip"></el-table-column>
				<el-table-column label="操作地点" prop="location"></el-table-column>
				<el-table-column label="操作方法" prop="method"></el-table-column>
				<el-table-column label="操作内容" prop="operation"></el-table-column>
				<el-table-column label="方法参数" prop="params"></el-table-column>
				<el-table-column label="操作耗时" prop="time"></el-table-column>
				<el-table-column label="操作用户" prop="username"></el-table-column>
				<el-table-column label="操作"  :fixed="tableData.length > 0?'right':false" >
					<template v-slot="{ row }">
						<el-link type="danger" @click="deleteRow(row.id)">删除</el-link>
					</template>
				</el-table-column>
				<el-empty description="暂无数据" slot="empty"><el-button type="primary" @click="startGetTableData">尝试获取</el-button></el-empty>
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
		<FormDrawer ref="FormDrawer" title="查询表单" @submit="submit" @success="startGetTableData" @closed="emptyForm">
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
				<el-form-item prop="userName" label="操作用户"><el-input v-model="Form.userName" /></el-form-item>
				<el-form-item prop="ip" label="IP地址"><el-input v-model="Form.ip" /></el-form-item>
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
			<el-button type="success" slot="footer" @click="exportToExcel">导出表格</el-button>
		</FormDrawer>
	</el-row>
</template>
<script>
import ApiSystemLog from '@/api/system/systemLog.js';
import FormUtil from '@/utils/formUtil.js';
import FormDrawer from '@/components/FormDrawer/index.vue';
import $_Confirm from '@/utils/confirm.js';
import TablePagination from '@/components/TablePagination/index.vue';
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
				userName: '',
				createTimeFrom: '',
				createTimeTo: '',
				ip: ''
			},
			Rules: {
				// userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
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
		};
	},
	components: {
		TablePagination,
		FormDrawer
	},
	computed: {},
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
			let { code, data, msg } = await ApiSystemLog.selectSystemLog(params).finally(()=>{
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
			ApiSystemLog.exportSystemLogToExcel(params);
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await ApiSystemLog.deleteSystemLogByIds(ids);
					if (code == 10200) {
						this.getTableData();
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
