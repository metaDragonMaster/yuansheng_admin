<template>
	<FormDialog ref="FormDialog" :title="dialogTitle" width="800px" top="12vh" v-model="show" :drag="false">
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="7rem">
			{{Form}}
			<!-- <el-form-item prop="photoName" label="宣传图名称"><el-input v-model="Form.photoName"></el-input></el-form-item> -->
			<el-form-item prop="chargePeriod" label="账期"><el-input v-model="Form.chargePeriod"></el-input></el-form-item>
			<el-form-item prop="chargePeriodType" label="账期类型">
				<el-select v-model="Form.chargePeriodType">
					<el-option v-for="item in selectChargePeriodType" :key="item.id" :value="item.id" :label="item.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="goodsName" label="商品名称"><el-input v-model="Form.goodsName"></el-input></el-form-item>
			<el-form-item prop="goodsNum" label="商品数量"><el-input-number v-model.number="Form.goodsNum" :min="1"  ></el-input-number></el-form-item>
			<el-form-item prop="goodsUnitPrice" label="商品单价"><el-input-number v-model.number="Form.goodsUnitPrice" :precision="2" :step="0.01" :min="0.01"  ></el-input-number></el-form-item>
			<el-form-item prop="logisticsChargeType" label="物流类型">
				<el-select v-model="Form.logisticsChargeType">
					<el-option v-for="item in selectChargePeriodType" :key="item.id" :value="item.id" :label="item.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="logisticsCompany" label="物流公司"><el-input v-model="Form.logisticsCompany"></el-input></el-form-item>
			<el-form-item prop="logisticsPrice" label="物流费用"><el-input-number v-model.number="Form.logisticsPrice"  :precision="2" :step="0.01"  :min="0.01" ></el-input-number></el-form-item>
			<el-form-item prop="goodsWeightTypeId" label="重量单位">
				<el-select v-model="Form.goodsWeightTypeId">
					<el-option v-for="item in selectGoodsWeightType" :key="item.id" :value="item.id" :label="item.unit"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="goodsTypeId" label="商品类型">
				<el-select v-model="Form.goodsTypeId">
					<el-option v-for="item in selectGoodsType" :key="item.id" :value="item.id" :label="item.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="userShopId" label="供货商品品牌">
				<el-select v-model="Form.userShopId">
					<el-option v-for="item in selectPropagateList" :key="item.id" :value="item.id" :label="item.photoName"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input type="textarea" :autosize="{ minRows: 8, maxRows: 16 }" v-model="Form.remark" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item prop="goodsTitleImage" label="标题图片">
				<UploadImg ref="UploadGoodsTitleImage" moduleName="web" :limit="1" v-model="Form.goodsTitleImage"></UploadImg>
			</el-form-item>
			<el-form-item prop="goodsImageList" label="图片列表">
				<UploadImg ref="UploadGoodsImageList" moduleName="web" :limit="10" v-model="Form.goodsImageList"></UploadImg>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<el-button @click="close()">取消</el-button>
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
		<!-- 
			<UploadImg ref="UploadImage" moduleName="web" v-model="Form.photoUrl"></UploadImg>
		 -->
	</FormDialog>
</template>
<script>
import Api from '@/api/nzjc/ghGoods.js';
import FormUtil from '@/utils/formUtil.js';

import UploadImg from "@/components/UploadImg/index.vue"
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	props:{
		selectGoodsWeightType:{
			type:Array,
			required:true,
		},
		selectGoodsType:{
			type:Array,
			required:true,
		},
		selectPropagateList:{
			type:Array,
			required:true,
		},
	},
	data() {
		return {
			formName: 'EditGhGoodForm',
			show: false,
			id:'',
			Form: {
				chargePeriod:"",//		供货商品-账期		false	integer(int32)
				chargePeriodType:"",//	供货商品-账期类型		false	integer(int32)
				goodsImageList:"",//	供货商品-图片列表		false	array/object
				goodsName:"",//			供货商品名称		false	string
				goodsNum:"",//			供货商品数量		false	string
				goodsTitleImage:"",//	供货商品标题图片		false	string
				goodsTypeId:"",//		商品类型ID		false	integer(int32)
				goodsUnitPrice:"",//	供货商品单价		false	string
				goodsWeightTypeId:"",//	商品计重单位ID		false	integer(int32)
				logisticsChargeType:"",//	供货商品-物流类型		false	integer(int32)
				logisticsCompany:"",//	供货商品-物流公司		false	string
				logisticsPrice:"",//	供货商品-物流费用		false	string
				remark:"",//			备注		false	string
				userShopId:"",//		供货商品-品牌ID		false	integer(int32)
			},
			Rules: {
			},
			selectChargePeriodType:[
				{id:"1",name:"类型1"},
				{id:"2",name:"类型2"},
			],
			selectLogisticsChargeType:[
				{id:"1",name:"类型1"},
				{id:"2",name:"类型2"},
			],
		};
	},
	components: {
		FormDialog,
		UploadImg,
	},
	computed:{
		dialogTitle() {
			return (this.isAdd? '新增':'修改') + '供货商品'
		},
		isAdd() {
			return !this.id
		}
	},
	methods: {
		open(row) {
			this.show = true;
			if (row) {
				this.$nextTick(()=>{
					this.Form = FormUtil.combineAttrs(this.Form, row);
				})
			}
		},
		close() {
			this.emptyForm(this.formName);
			this.show = false;
		},
		async submit() {
			this.validateForm(this.formName).then(async () => {
				let goodsImageList = this.$refs['UploadGoodsImageList'].uploadImg();
				this.Form.goodsImageList = JSON.stringify(goodsImageList);
				let params = {
					...this.Form,
				};
				let res;
				!this.Form.propagatePhotoId?res = await Api.addGood(params):res = await Api.updateGoodById(params);
				let { code, data, msg } =res;
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				this.close();
				this.$emit('success');
			} else {
				this.$message.warning(`warning:${ErrorMsg}`);
			}
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
.el-input {
	width: fit-content;
}
</style>
