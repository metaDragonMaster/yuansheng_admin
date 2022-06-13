<style lang="scss" scoped="scoped">
.table-small-image {
	max-width: 200px;
}
.el-image {
	max-width: 120px;
}
.span-success {
	color: #42d885;
}
.span-danger {
	color: #ff4949;
}
.span-warning {
	color: #ffba00;
}
</style>

<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>品牌馆店铺</span>
				<el-button @click="$refs['EditShopDialog'].open()" type="success" class="drift-right">添加店铺</el-button>
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
				<el-table-column label="品牌馆名称" prop="shopName" min-width="200"></el-table-column>
				<el-table-column label="地域" prop="regionId" min-width="200" filter-multiple="">
					<template v-slot="{ row }">
						<span>{{ filterAddressLabel(row.regionId) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="主营" prop="mainBusiness" min-width="200"></el-table-column>
				<el-table-column label="介绍" prop="introduction" min-width="200"></el-table-column>
				<el-table-column label="状态" prop="status" min-width="200">
					<template v-slot="{ row }">
						<span :class="statusClass(row)">{{ getItemLabel(selectStatus, row.status) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="小图-品牌图标（圆形）" prop="circleImageSmall" min-width="200">
					<template v-slot="{ row }">
						<el-image :src="row.circleImageSmall" fit="contain" :preview-src-list="[row.circleImageSmall]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="小图-品牌图标（方形）" prop="squareImageSmall" min-width="200">
					<template v-slot="{ row }">
						<el-image :src="row.squareImageSmall" fit="contain" :preview-src-list="[row.squareImageSmall]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="图片列表" prop="imageList" min-width="200">
					<template v-slot="{ row }">
						<el-image :src="row.imageList.length > 0 ? row.imageList[0] : ''" fit="contain" :preview-src-list="row.imageList"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="操作" :fixed="tableData.length > 0 ? 'right' : false" width="160">
					<template v-slot="{ row }">
						<el-link type="warning" @click="$refs['EditShopDialog'].open(row)">修改</el-link>
						<el-link type="success" v-show="row.status == '-1'" @click="activeRow(row.id)">激活</el-link>
						<el-link type="danger" v-show="row.status == '2'" @click="frostRow(row.id)">冻结</el-link>
						<el-link type="warning" v-show="row.status == '0'" @click="$refs['CheckShopDialog'].open(row)">审核</el-link>
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
		<FormDrawer ref="FormDrawer" size="600px" title="查询表单" @submit="submit" @success="startGetTableData">
			<el-form ref="Form" :model="Form" :rules="Rules" inline label-position="right" label-width="120px">
				<el-form-item label="品牌馆名称" prop="shopName"><el-input v-model="Form.shopName"></el-input></el-form-item>
				<el-form-item label="主营" prop="mainBusiness"><el-input v-model="Form.mainBusiness"></el-input></el-form-item>
				<el-form-item label="地域" prop="regionId"><SeleteAddress v-model="Form.regionId"></SeleteAddress></el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="Form.status"><el-option v-for="item in selectStatus" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
				</el-form-item>
			</el-form>
			<el-button type="warning" slot="footer" @click="emptyForm('Form')">重置</el-button>
		</FormDrawer>
		<EditShopDialog ref="EditShopDialog" @success="startGetTableData()"></EditShopDialog>
		<CheckShopDialog ref="CheckShopDialog" @success="startGetTableData()"></CheckShopDialog>
	</el-row>
</template>
<script>
import Api from '@/api/ncq/shop.js';
import $_Confirm from '@/utils/confirm.js';
import FormUtil from '@/utils/formUtil.js';

import SeleteAddress from '@/components/SelectAddress/cascader.vue';
import EditShopDialog from './components/EditShopDialog.vue';
import CheckShopDialog from './components/CheckShopDialog.vue';

import FormDrawer from '@/components/FormDrawer/index.vue';
import TablePagination from '@/components/TablePagination/index.vue';
import chinaData from '@/utils/json/chinaData.json';
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
				mainBusiness: '', //	主营	query	false	 string
				regionId: '', //	地域ID	query	false	 integer(int32)
				shopName: '', //	品牌馆名称	query	false	 string
				status: '' //		query	false	  integer(int32)
			},
			Rules: {},
			selectStatus: [
				{ value: '0', label: '待审核', className: 'span-success' },
				{ value: '1', label: '已提交人工审核', className: 'span-success' },
				{ value: '2', label: '审核成功', className: 'span-success' },
				{ value: '3', label: '失败', className: 'span-danger' },
				{ value: '-1', label: '冻结', className: 'span-warning' }
			]
		};
	},
	components: {
		FormDrawer,
		TablePagination,

		SeleteAddress,
		EditShopDialog,
		CheckShopDialog
	},
	mounted() {
		this.init();
	},
	methods: {
		getItemLabel: FormUtil.getItemLabel,
		statusClass(row) {
			let item = FormUtil.getItem(this.selectStatus, row.status);
			return [item.className];
			// return ['span-red'];
		},
		filterAddressLabel(stringAddress) {
			let addressList = stringAddress.split(',');
			return this.getTreeName(addressList, chinaData);
		},
		getTreeName(adds, list) {
			let label = '';
			let addsLength = adds.length;
			for (let i = 0; i < list.length; i++) {
				let a = list[i];
				if (a.value === adds[0]) {
					let s = addsLength <= 1 ? ' ' : '-';
					label += a.label + s;
					if (a.children && a.children.length > 0) {
						adds.shift();
						--addsLength;
						label += this.getTreeName(adds, a.children);
					}
					return label;
				}
			}
		},
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
			console.log(params);
			return params;
		},
		async getTableData() {
			this.tableLoading = true;
			let params = await this.fliterFrom();
			let { code, data, msg } = await Api.selectShopList(params).finally(() => {
				this.tableLoading = false;
			});
			if (code == 10200) {
				this.tableData = [];
				data.records.map(item => {
					item.imageList = item.imageList && item.imageList.length > 0 ? item.imageList.split(',') : [''];
					this.tableData.push(item);
				});
				// console.log(this.tableData);
				this.tableQueryOption.total = data.total;
			}
			this.tableLoading = false;
		},
		async deleteRow(id) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await Api.deleteShop(id);
					if (code == 10200) {
						this.startGetTableData();
					}
				}
			});
		},
		async frostRow(id) {
			$_Confirm({
				title: '冻结操作',
				content: '是否确认冻结该店铺',
				thenFunc: async () => {
					let { code, data, msg } = await Api.setShopFrost(id);
					if (code == 10200) {
						this.startGetTableData();
					}
				}
			});
		},
		async activeRow(id) {
			$_Confirm({
				title: '激活操作',
				content: '是否确认激活该店铺',
				thenFunc: async () => {
					let { code, data, msg } = await Api.setShopAliveById(id);
					if (code == 10200) {
						this.startGetTableData();
					}
				}
			});
		}
	}
};
</script>
