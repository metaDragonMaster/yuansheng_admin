<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>品牌馆宣传</span>
				<el-button @click="$refs['EditPropagateDialog'].open()" type="success" class="drift-right">新增</el-button>
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
				<el-table-column label="宣传图名称" prop="photoName"  min-width="100"></el-table-column>
				<el-table-column label="宣传图类型" prop="photoType"  min-width="100"
					:formatter="row=>getItemLabel(selectPhotoType,row.photoType)"
				></el-table-column>
				<el-table-column label="宣传图地址" prop="photoUrl"   width="100">
					<template v-slot="{row}">
						<el-image :src="row.photoUrl" fit="contain" :preview-src-list="[row.photoUrl]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="跳转地址" prop="redirectUrl"  min-width="100"></el-table-column>
				<el-table-column label="操作" :fixed="tableData.length > 0 ? 'right' : false" min-width="120">
					<template v-slot="{ row }">
						<el-link type="warning" @click="$refs['EditPropagateDialog'].open(row)">修改</el-link>
						<el-link type="danger" @click="deleteRow(row.id)">删除</el-link>
					</template>
				</el-table-column>
				<el-empty description="暂无数据" slot="empty"><el-button type="primary" @click="getTableData">尝试获取</el-button></el-empty>
			</el-table>
		</el-card>
		<EditPropagateDialog ref="EditPropagateDialog" @success="getTableData"></EditPropagateDialog>
	</el-row>
</template>
<script>
import Api from '@/api/nzjc/propagate.js';
import $_Confirm from '@/utils/confirm.js';
import FormUtil from '@/utils/formUtil.js';

import EditPropagateDialog from "./components/EditPropagateDialog.vue"
export default {
	data() {
		return {
			tableLoading: false,
			tableData: [],
			selectPhotoType:[
				{value:0,label:"不跳转商品页面"},
				{value:1,label:"跳转商品页面"},
			],
		};
	},
	components: {
		EditPropagateDialog,
	},
	mounted() {
		this.init();
	},
	methods: {
		
		getItemLabel: FormUtil.getItemLabel,
		init() {
			this.getTableData();
		},
		async getTableData() {
			this.tableLoading = true;
			let { code, data, msg } = await Api.selectPropagateList().finally(() => {
				this.tableLoading = false;
			});
			if (code == 10200) {
				this.tableData = data;
			}
			this.tableLoading = false;
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await Api.deletePropagateById(ids);
					if (code == 10200) {
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