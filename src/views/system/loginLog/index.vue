<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>用户登录日志</span>
				<!-- <el-button @click="getLoginLogOfCurrentUser" type="primary" class="drift-right">展示本人记录</el-button> -->
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
				<el-table-column label="用户名称" prop="username" min-width="120" fixed="left"></el-table-column>
				<el-table-column label="登录时间" prop="loginTime" min-width="160" fixed="left"></el-table-column>
				<el-table-column label="浏览器类型" prop="browser" min-width="120"></el-table-column>
				<el-table-column label="创建时间" prop="createTime" min-width="160"></el-table-column>
				<el-table-column label="访问地址IP" prop="ip" min-width="120"></el-table-column>
				<el-table-column label="访问地点" prop="location" min-width="160"></el-table-column>
				<el-table-column label="登录系统" prop="os"></el-table-column>
				<el-table-column label="操作" :fixed="tableData.length > 0 ? 'right' : false">
					<template v-slot="{ row }">
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
		<FormDrawer ref="FormDrawer" size="372px" title="查询表单" @submit="submit" @success="startGetTableData" @closed="emptyForm">
			{{ Form }}
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
				<el-form-item prop="userName" label="操作用户"><el-input v-model="Form.userName" /></el-form-item>
				<!--
         <el-form-item prop="os" label="登录系统">
         <el-select v-model="Form.os" placeholder="请选择">
         	<el-option v-for="item in selectOs" :key="item.value" :label="item.label" :value="item.value"></el-option>
         </el-select>
        </el-form-item>
        -->
				<el-form-item prop="createTimeFrom" label="开始时间">
					<el-date-picker
						v-model="Form.createTimeFrom"
						:picker-options="pickerOptionsStart"
						type="datetime"
						value-format="yyyy-MM-dd hh:mm:ss"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
				<el-form-item prop="createTimeTo" label="结束时间">
					<el-date-picker
						v-model="Form.createTimeTo"
						:picker-options="pickerOptionsEnd"
						type="datetime"
						value-format="yyyy-MM-dd hh:mm:ss"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<el-button type="success" slot="footer" @click="exportToExcel">导出表格</el-button>
		</FormDrawer>
	</el-row>
</template>
<script>
import ApiLoginLog from '@/api/system/loginLog.js';
import FormUtil from '@/utils/formUtil.js';
import FormDrawer from '@/components/FormDrawer/index.vue';
import $_Confirm from '@/utils/confirm.js';
import moment from 'moment';
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
				createTimeTo: ''
				// os:'',
				// ip: '',

				// browser:'',
				// location:'',
				// loginTime:'',
			},
			Rules: {
				// createTimeFrom: [{ validator: this.validatorCreateTimeFrom, trigger: 'blur' }],
				// createTimeTo: [{ validator: this.validatorCreateTimeTo, trigger: 'blur' }]
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
		FormDrawer,
		TablePagination
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
		// async getLoginLogOfCurrentUser() {
		//   let { code, data, msg } = await ApiLoginLog.getLoginLogOfCurrentUser();
		//   console.log(data)
		// },
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
			let { code, data, msg } = await ApiLoginLog.selectLoginLog(params).finally(() => {
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
			ApiLoginLog.exportLoginLogToExcel(params);
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await ApiLoginLog.deleteLoginLogByIds(ids);
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
