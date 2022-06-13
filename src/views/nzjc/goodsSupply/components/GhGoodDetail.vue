<template>
	<el-dialog :title="dialogTitle" :visible.sync="show" top="16vh" width="460px" :close-on-click-modal="false" append-to-body >
		<el-form ref="Form" label-position="right" label-width="120px">
			<el-form-item label="账期">{{Form.chargePeriod}}</el-form-item>
			<el-form-item label="账期类型">{{Form.chargePeriodType}}</el-form-item>
			<el-form-item label="最迟发货时间">{{Form.endTime}}</el-form-item>
			<el-form-item label="图片列表">{{Form.goodsImageList}}</el-form-item>
			<el-form-item label="供货商品名称">{{Form.goodsName}}</el-form-item>
			<el-form-item label="供货商品数量">{{Form.goodsNum}}</el-form-item>
			<el-form-item label="供货商品标题图片">{{Form.goodsTitleImage}}</el-form-item>
			<el-form-item label="供货商品类型">{{Form.goodsTypeId}}</el-form-item>
			<el-form-item label="是否立即发货">{{Form.isNowRelease}}</el-form-item>
			<el-form-item label="物流类型">{{Form.logisticsChargeType}}</el-form-item>
			<el-form-item label="物流公司">{{Form.logisticsCompany}}</el-form-item>
			<el-form-item label="物流费用">{{Form.logisticsPrice}}</el-form-item>
			<el-form-item label="备注">{{Form.remark}}</el-form-item>
			<el-form-item label="品牌馆名称">{{Form.shopName}}</el-form-item>
			<el-form-item label="供货商品状态">{{Form.status}}</el-form-item>
			<el-form-item label="供货商品计重单位">{{Form.unit}}</el-form-item>
			<el-form-item label="品牌馆ID">{{Form.userShopId}}</el-form-item>
		</el-form>
		<div drift-right>
			<el-button @click="show = false">返回</el-button>
		</div>
	</el-dialog>
</template>
<script>
import Api from '@/api/nzjc/ghGoods.js';
import FormUtil from '@/utils/formUtil.js';

export default {
	data() {
		return {
			show: false,
			Form: {
				cashPayNum: "50"
				cgGoodsId: 6
				endTime: "2021-09-01 00:00:00"
				financePayNum: "50"
				goodsDetailAddress: null
				goodsImageList: ["https://img0.baidu.com/it/u=3994988717,2992653053&fm=26&fmt=auto&gp=0.jpg"]
				goodsInfoRichText: null
				goodsName: "采购需求单-商品名称"
				goodsNum: null
				goodsTitleImage: "https://img0.baidu.com/it/u=3994988717,2992653053&fm=26&fmt=auto&gp=0.jpg"
				isNeedFinance: false
				isNowRelease: false
				remark: "测试数据-add-1"
				shopName: null
				status: 1
				unit: "吨"
			},
			dialogTitle: ''
		};
	},
	components: {
		// WangEditor,
		// UploadImg
	},
	computed: {},
	mounted() {},
	methods: {
		async open(row) {
			console.log(row);
			this.show = true;
			this.dialogTitle = `审核商品:${row.goodsName}`;
			let { code, data, msg } = await Api.getGoodInfoById(row.cgGoodsId);
			
		},
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
