<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>合作社农户管理</span>
				<!-- <el-button @click="emptyQuery" type="primary" class="drift-right">清空条件</el-button> -->
				<el-button @click="$refs['EditFarmer'].open()" type="success" class="drift-right">新增农户</el-button>
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
				<el-table-column label="农户地址" prop="address" min-width="160"></el-table-column>
				<el-table-column label="农业收入" prop="agriculturalIncome" min-width="160"></el-table-column>
				<el-table-column label="年总收入" prop="annualIncome" min-width="160"></el-table-column>
				<el-table-column label="农户身份证" prop="certificationNo" min-width="160"></el-table-column>
				<el-table-column label="住房面积（平方米）" prop="houseArea" min-width="160"></el-table-column>
				<el-table-column label="住房情况" prop="house" min-width="160"></el-table-column>
				<el-table-column label="农户电话" prop="phoneNo"min-width="160" ></el-table-column>
				<el-table-column label="农户名字" prop="realName"min-width="160" ></el-table-column>
				<el-table-column label="操作" :fixed="tableData.length > 0?'right':false"  min-width="160">
					<template v-slot="{ row }">
						<el-link type="primary" @click="$refs['EditFarmer'].open(row.id)">查看信息</el-link>
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
		<EditFarmer ref="EditFarmer" @success="startGetTableData()" ></EditFarmer>
		<FormDrawer ref="FormDrawer" size="600px" title="查询表单" @submit="submit" @success="startGetTableData">
			<!--  @closed="emptyForm" -->
			<el-form ref="Form" :model="Form" :rules="Rules" inline label-position="right" label-width="120px">
				<el-form-item label="" ></el-form-item>
			</el-form>
			<el-button type="warning" slot="footer" @click="emptyForm('Form')">重置</el-button>
		</FormDrawer>
	</el-row>
</template>
<script>
import Api from '@/api/nzjc/cooperativeFarmerManage.js';
import $_Confirm from '@/utils/confirm.js';
import FormUtil from '@/utils/formUtil.js';

// import SelectAddress from '@/components/SelectAddress/cascader.vue';
import FormDrawer from '@/components/FormDrawer/index.vue';
import TablePagination from '@/components/TablePagination/index.vue';
import EditFarmer from './components/EditFarmer/index.vue';
import selectMixin from './selectMixin.js';

export default {
	mixins: [selectMixin],
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
				cooperativeId:"",//	合伙企业ID	query	true	integer(int32)
				address:"",//	通讯地址	query	false	string
				adminLv:"",//	管理员等级（0 普通成员，1一级管理员， 2二级管理员）	query	false	integer(int32)
				age:"",//	年龄	query	false	integer(int32)
				certificationNo:"",//	身份证号码	query	false	string
				cityNo:"",//	所在城市	query	false	string
				createTimeFrom:"",//	起始时间	query	false	string
				createTimeTo:"",//	截止时间	query	false	string
				current:"",//	当前页码	query	false	integer(int32)
				farmerId:"",//	农户id	query	false	integer(int32)
				field:"",//	排序字段	query	false string
				health:"",//	健康状况（0 健康 1一般 2 欠佳）	query	false	integer(int32)
				isHost:"",//	是否是户主	query	false	boolean
				job:"",//	工作	query	false	string
				order:"",//	排序规则，asc升序，desc降序	query	false	string
				phoneNo:"",//	联系电话	query	false	string
				politicalStatus:"",//	政治面貌（0群众 1党员）	query	false integer(int32)
				realName:"",//	真实姓名	query	false	string
				sex:"",//	性别 0男 1女 2保密	query	false	string
				size:"",//	当前页面数据量	query	false	integer(int32)
			},
			Rules: {},
		};
	},
	components: {
		FormDrawer,
		TablePagination,
		EditFarmer,
		// SelectAddress,
	},
	mounted() {
		// this.init();
	},
	methods: {
		getItemLabel:FormUtil.getItemLabel,
		async emptyQuery() {
			await this.emptyForm('Form');
			this.startGetTableData()
		},
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
			params.cooperativeId = this.cooperativeInfo.id;
			return params;
		},
		async getTableData() {
			this.tableLoading = true;
			let params = await this.fliterFrom();
			let { code, data, msg } = await Api.selectFarmerInfoList(params).finally(() => {
				this.tableLoading = false;
			});
			if (code == 10200) {
				this.tableData = data.records;
				this.tableQueryOption.total = data.total;
			}
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await Api.deleteFarmerById(ids);
					if (code == 10200) {
						this.tableQueryOption.current = 1;
						this.getTableData();
					}
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped="scoped"></style>
