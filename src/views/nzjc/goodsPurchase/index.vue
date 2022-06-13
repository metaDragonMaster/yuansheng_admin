<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>采购商品</span>
				<el-button @click="$refs['EditCgGoods'].open()" type="primary" class="drift-right">新增</el-button>
				<!-- <el-button @click="$refs['FormDrawer'].open()" type="primary" class="drift-right">打开查询表单</el-button> -->
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
				<el-table-column label="最迟发货时间" prop="endTime" min-width="180"></el-table-column>
				<el-table-column label="商品名称" prop="goodsName" min-width="180"></el-table-column>
				<el-table-column label="商品数量" prop="goodsNum" min-width="120"></el-table-column>
				<el-table-column label="标题图片" prop="goodsTitleImage" width="140">
					<template v-slot="{row}">
						<el-image :src="row.goodsTitleImage" fit="contain" :preview-src-list="[row.goodsTitleImage]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="是否需要金融服务" prop="isNeedFinance" min-width="140"></el-table-column>
				<el-table-column label="是否立即发货" prop="isNowRelease" min-width="120"></el-table-column>
				<!-- <el-table-column label="商品状态" prop="status" min-width="120"></el-table-column> -->
				<el-table-column label="计重单位" prop="unit" min-width="140"></el-table-column>
				<el-table-column label="操作" :fixed="tableData.length > 0 ? 'right' : false" min-width="200">
					<template v-slot="{ row }">
						<el-link type="warning" @click="$refs['CgGoodDetail'].open(row)">查看详情</el-link>
						<el-link type="warning" @click="$refs['SetAudit'].open(row)">审核</el-link>
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
		<EditCgGoods
			ref="EditCgGoods"
			@success="startGetTableData"
			:selectGoodsWeightType="goodsWeightType"
			:selectGoodsType="goodsType"
			:selectPropagateList="propagateList"
		></EditCgGoods>
		<SetAudit
			ref="SetAudit"
			@success="startGetTableData"
		></SetAudit>
		<CgGoodDetail ref="CgGoodDetail"></CgGoodDetail>
		<!-- 	<FormDrawer ref="FormDrawer" title="查询表单" @submit="submit" @success="getTableData" @closed="emptyForm">
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
			</el-form>
			<el-button type="success" slot="footer" @click="exportToExcel">导出表格</el-button>
		</FormDrawer> -->
	</el-row>
</template>
<script>
import Api from '@/api/nzjc/cgGoods.js';
import ApiGoodsWeightType from '@/api/nzjc/goodsWeightType.js';
import ApiGoodsType from '@/api/nzjc/goodsType.js';
import ApiPropagate from '@/api/nzjc/propagate.js';
import FormUtil from '@/utils/formUtil.js';
import $_Confirm from '@/utils/confirm.js';

import FormDrawer from '@/components/FormDrawer/index.vue';
import TablePagination from '@/components/TablePagination/index.vue';
import EditCgGoods from './components/EditCgGoods.vue';
import SetAudit from './components/SetAudit.vue';
import CgGoodDetail from './components/CgGoodDetail.vue';

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
			Form: {},
			Rules: {
				// userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
			},
			goodsWeightType: [],
			goodsType: [],
			propagateList: []
		};
	},
	components: {
		TablePagination,
		FormDrawer,
		EditCgGoods,
		SetAudit,
		CgGoodDetail,
	},
	computed: {},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.getTableData();
			this.getGoodsWeightType();
			this.getGoodsType();
			this.selectPropagateList();
		},
		async getGoodsWeightType() {
			let { code, data, msg } = await ApiGoodsWeightType.getGoodsWeightType();
			this.goodsWeightType = data;
		},
		async getGoodsType() {
			let { code, data, msg } = await ApiGoodsType.getGoodsType();
			this.goodsType = data;
		},
		async selectPropagateList() {
			let { code, data, msg } = await ApiPropagate.selectPropagateList();
			this.propagateList = data;
		},
		submit() {
			this.validateForm('Form').then(res => {
				this.$refs['FormDrawer'].closeDrawer();
			});
		},
		startGetTableData() {
			this.tableQueryOption.current = 1;
			this.getTableData();
		},
		async getTableData() {
			this.tableLoading = true;
			// let params = await this.fliterFrom();
			let params = {
				current: this.tableQueryOption.current,
				size: this.tableQueryOption.size
			};
			let { code, data, msg } = await Api.selectGoodsList(params).finally(() => {
				this.tableLoading = false;
			});
			if (code == 10200) {
				this.tableData = data.records;
				this.tableQueryOption.total = data.total;
			}
			this.tableLoading = false;
		},
		async deleteRow(id) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await Api.deleteGoodById(id);
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
