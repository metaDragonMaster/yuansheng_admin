<template>
	<el-dialog :title="dialogTitle" :visible.sync="show" top="16vh" width="900px" :close-on-click-modal="false" append-to-body>
		{{Form}}
		<el-form ref="Form" label-position="right" label-width="9rem" inline>
			<el-form-item label="现金支付数量">{{ Form.cashPayNum }}</el-form-item>
			<el-form-item label="采购商品">{{ Form.cgGoodsId }}</el-form-item>
			<el-form-item label="金融支付数量">{{ Form.financePayNum }}</el-form-item>
			<el-form-item label="详细收货地址">{{ Form.goodsDetailAddress }}</el-form-item>
			<el-form-item label="富文本描述">{{ Form.goodsInfoRichText }}</el-form-item>
			<el-form-item label="是否需要金融服务">{{!!Form.isNeedFinance&&Form.isNeedFinance?'是':'否'||''}}</el-form-item>
			<el-form-item label="最迟发货时间">{{ Form.endTime }}</el-form-item>
			<el-form-item label="供货商品名称">{{ Form.goodsName }}</el-form-item>
			<el-form-item label="供货商品数量">{{ Form.goodsNum }}</el-form-item>
			<el-form-item label="供货商品标题图片"><el-image :src="Form.goodsTitleImage"></el-image></el-form-item>
			<el-form-item label="图片列表">
				<el-image v-for="(item,index) in Form.goodsImageList" :key="index" :src="item" fit="contain" :preview-src-list="Form.goodsImageList"></el-image>
			</el-form-item>
			<el-form-item label="是否立即发货">{{!!Form.isNowRelease&&Form.isNowRelease?'是':'否'||''}}</el-form-item>
			<el-form-item label="备注">{{ Form.remark }}</el-form-item>
			<el-form-item label="品牌馆名称">{{ Form.shopName }}</el-form-item>
			<el-form-item label="供货商品状态">{{ Form.status }}</el-form-item>
			<el-form-item label="供货商品计重单位">{{ Form.unit }}</el-form-item>
		</el-form>
		<div drift-right><el-button @click="show = false">返回</el-button></div>
	</el-dialog>
</template>
<script>
import Api from '@/api/nzjc/cgGoods.js';
import FormUtil from '@/utils/formUtil.js';

export default {
	data() {
		return {
			show: false,
			Form: {
				cashPayNum: "''",
				cgGoodsId: '',
				endTime: '',
				financePayNum: '',
				goodsDetailAddress: '',
				goodsImageList: [],
				goodsInfoRichText: '',
				goodsName: '',
				goodsNum: '',
				goodsTitleImage: '',
				isNeedFinance: '',
				isNowRelease: '',
				remark: '',
				shopName: '',
				status: '',
				unit: ''
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
			this.Form = FormUtil.combineAttrs(this.Form, data);
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
.el-image {
	max-width: 120px;
}
</style>
