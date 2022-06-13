<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>供货商品</span>
				<el-button @click="$refs['EditGhGoods'].open()" type="primary" class="drift-right">添加</el-button>
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
			<!-- 
				goodsTypeId	供货商品类型ID	integer(int32)	
				shopName	品牌馆名称	string	
				userShopId	品牌馆ID	integer(int32)	
			 -->
				<el-table-column label="商品名称" prop="goodsName" min-width="180"></el-table-column>
				<el-table-column label="商品数量" prop="goodsNum" min-width="120"></el-table-column>
				<el-table-column label="标题图片" prop="goodsTitleImage" width="140">
					<template v-slot="{row}">
						<el-image :src="row.goodsTitleImage" fit="contain" :preview-src-list="[row.goodsTitleImage]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="状态" prop="status" min-width="120"></el-table-column>
				<el-table-column label="计重单位" prop="unit" min-width="140"></el-table-column>
				<!-- <el-table-column label="供货商品类型" prop="goodsTypeId" min-width="140"></el-table-column> -->
				<el-table-column label="品牌馆名称" prop="shopName" min-width="140"></el-table-column>
				<el-table-column label="操作"  :fixed="tableData.length > 0?'right':false" >
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
		<EditGhGoods 
			ref="EditGhGoods" 
			@success="startGetTableData" 
			:selectGoodsWeightType="goodsWeightType" 
			:selectGoodsType="goodsType" 
			:selectPropagateList="propagateList"
		></EditGhGoods>
		<!-- <FormDrawer ref="FormDrawer" title="查询表单" @submit="submit" @success="getTableData" @closed="emptyForm">
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
			</el-form>
		</FormDrawer> -->
	</el-row>
</template>
<script>
import Api from '@/api/nzjc/ghGoods.js';
import ApiGoodsWeightType from "@/api/nzjc/goodsWeightType.js";
import ApiGoodsType from "@/api/nzjc/goodsType.js";
import ApiPropagate from '@/api/nzjc/propagate.js';
import FormUtil from '@/utils/formUtil.js';
import FormDrawer from '@/components/FormDrawer/index.vue';
import $_Confirm from '@/utils/confirm.js';
import TablePagination from '@/components/TablePagination/index.vue';
import EditGhGoods from "./components/EditGhGoods.vue"
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
			},
			Rules: {
				// userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
			},
			goodsWeightType:[],
			goodsType:[],
			propagateList:[],
		};
	},
	components: {
		TablePagination,
		FormDrawer,
		EditGhGoods
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
			let {code,data,msg} = await ApiGoodsWeightType.getGoodsWeightType();
			this.goodsWeightType = data;
		},
		async getGoodsType() {
			let {code,data,msg} = await ApiGoodsType.getGoodsType();
			this.goodsType = data;
		},
		async selectPropagateList() {
			let {code,data,msg} = await ApiPropagate.selectPropagateList();
			this.propagateList = data;
		},
		
		// submit() {
		// 	this.validateForm('Form').then(res => {
		// 		this.$refs['FormDrawer'].closeDrawer();
		// 	});
		// },
		startGetTableData() {
			this.tableQueryOption.current = 1;
			this.getTableData();
		},
		async getTableData() {
			this.tableLoading = true;
			// let params = await this.fliterFrom();
			let params = {
				current:this.tableQueryOption.current,
				size:this.tableQueryOption.size,
			}
			let { code, data, msg } = await Api.selectGoodsList(params).finally(()=>{
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
		},
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
