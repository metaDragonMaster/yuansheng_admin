<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>title</span>
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
				<el-table-column label="操作" :fixed="tableData.length > 0?'right':false" >
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
		<FormDrawer ref="FormDrawer" title="查询表单" @submit="submit" @success="getTableData" @closed="emptyForm">
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
				<!--  <el-form-item prop="userName" label="操作用户"><el-input v-model="Form.userName" /></el-form-item>
        <el-form-item prop="createTimeFrom" label="开始时间">
          <el-date-picker v-model="Form.createTimeFrom" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item prop="createTimeTo" label="结束时间">
          <el-date-picker v-model="Form.createTimeTo" type="datetime" placeholder="选择日期时间"></el-date-picker>
         </el-form-item> -->
			</el-form>
			<el-button type="success" slot="footer" @click="exportToExcel">导出表格</el-button>
		</FormDrawer>
	</el-row>
</template>
<script>
// import api from 'api.js';
import FormUtil from '@/utils/formUtil.js';
import FormDrawer from '@/components/FormDrawer/index.vue';
import $_Confirm from '@/utils/confirm.js';
import TablePagination from '@/components/TablePagination/index.vue';
export default {
	data() {
		return {
			drawer: false,
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
			},
			Rules: {
				// userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
			}
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
		init() {
			// this.getTableData();
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
			let { code, data, msg } = await Api.selectSystemLog(params).finally(()=>{
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
			Api.exportSystemLogToExcel(params);
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await Api.deleteSystemLogByIds(ids);
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
