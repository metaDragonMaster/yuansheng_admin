<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>商品管理</span>
				<!-- <el-button @click="emptyQuery" type="primary" class="drift-right">清空条件</el-button> -->
				<el-button @click="$refs['AddGoodsDialog'].open()" type="success" class="drift-right">添加商品</el-button>
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
				<el-table-column label="商品名称" prop="name" min-width="100"></el-table-column>
				<el-table-column label="供应商名称" prop="merchantName"  min-width="120"></el-table-column>
				<el-table-column label="商品类型" prop="goodsType"  min-width="100"></el-table-column>
				<el-table-column label="配送类型" prop="goodsPsType"  min-width="100"></el-table-column>
				<el-table-column label="审核状态" prop="approvalStatus"  min-width="100" :formatter="row=>getItemLabel(selectApprovalStatus,row.approvalStatus)"></el-table-column>
				<el-table-column label="商品组合ID" prop="goodsComposeId"  min-width="100"></el-table-column>
				<el-table-column label="产品规格类型" prop="goodsWeightType"  min-width="120"></el-table-column>
				<el-table-column label="小图" prop="imageSmall"  min-width="120">
					<template v-slot="{ row }">
						<!-- <el-image :style="{'width':'100px'}" :src="row.imageSmall" alt=""> -->
						<el-image class="table-small-image" :src="row.imageSmall" fit="contain" :preview-src-list="[row.imageSmall]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="简介" prop="introduction"  min-width="100"></el-table-column>
				<el-table-column label="商品价格" prop="price"  min-width="100"></el-table-column>
				<el-table-column label="状态" prop="status"  min-width="100"></el-table-column>
				<el-table-column label="操作" :fixed="tableData.length > 0 ? 'right' : false" min-width="120">
					<template v-slot="{ row }">
						<el-link type="primary" @click="$refs['AddGoodsDialog'].open(row)">修改</el-link>
						<el-link type="danger" @click="deleteRow(row.id)">删除</el-link>
						<!-- <el-button type="primary"></el-button> -->
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
		<FormDrawer ref="FormDrawer" size="600px" title="查询表单" @submit="submit" @success="startGetTableData">
			<!--  @closed="emptyForm" -->
			<el-form ref="Form" :model="Form" :rules="Rules" inline label-position="right" label-width="120px"><el-form-item label=""></el-form-item></el-form>
			<el-button type="warning" slot="footer" @click="emptyForm('Form')">重置</el-button>
		</FormDrawer>
		<AddGoodsDialog ref="AddGoodsDialog" @success="startGetTableData"></AddGoodsDialog>
	</el-row>
</template>
<script>
import Api from '@/api/nzjc/goodsManage.js';
import $_Confirm from '@/utils/confirm.js';
import FormUtil from '@/utils/formUtil.js';
// import selectMixin from "./selectMixin.js"

import AddGoodsDialog from './components/AddGoodsDialog.vue';

import SelectAddress from '@/components/SelectAddress/cascader.vue';
import FormDrawer from '@/components/FormDrawer/index.vue';
import TablePagination from '@/components/TablePagination/index.vue';
export default {
	// mixins:[selectMixin],
	data() {
		return {
			tableLoading: false,
			tableData: [],
			tableQueryOption: {
				size: 10,
				current: 1,
				total: 0
			},
			Form: {},
			Rules: {},
			selectApprovalStatus:[
				{value:-1,label:'待审核'},
				{value:1,label:'审核通过'},
				{value:0,label:'审核未通过'},
			]
		};
	},
	components: {
		FormDrawer,
		TablePagination,
		SelectAddress,

		AddGoodsDialog
	},
	computed: {},
	mounted() {
		this.init();
	},
	methods: {
		
		getItemLabel: FormUtil.getItemLabel,
		async emptyQuery() {
			await this.emptyForm('Form');
			this.startGetTableData();
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
			return params;
		},
		async getTableData() {
			this.tableLoading = true;
			let params = await this.fliterFrom();
			let { code, data, msg } = await Api.selectGoodsManageList(params).finally(() => {
				this.tableLoading = false;
			});
			if (code == 10200) {
				this.tableData = data.records;
				this.tableQueryOption.total = data.total;
			}
			this.tableLoading = false;
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await Api.deleteGoodsByIds(ids);
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
<style lang="scss" scoped="scoped">
.table-small-image {
	max-width: 200px;
}
</style>
