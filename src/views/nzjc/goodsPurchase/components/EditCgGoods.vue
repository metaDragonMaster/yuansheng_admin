<template>
	<FormDialog ref="FormDialog" :title="dialogTitle" width="886px" top="12vh" v-model="show" :drag="false">
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="9rem">
			<!-- {{ Form }} -->
			<el-form-item prop="cooperativeInfoId" label="合作社"><el-input v-model="Form.cooperativeInfoId"></el-input></el-form-item>
			<el-form-item prop="goodsName" label="商品名称"><el-input v-model="Form.goodsName"></el-input></el-form-item>
			<el-form-item prop="goodsTypeId" label="商品类型">
				<el-select v-model="Form.goodsTypeId"><el-option v-for="item in selectGoodsType" :key="item.id" :value="item.id" :label="item.name"></el-option></el-select>
			</el-form-item>
			<el-form-item prop="goodsWeightTypeId" label="商品计重单位">
				<el-select v-model="Form.goodsWeightTypeId">
					<el-option v-for="item in selectGoodsWeightType" :key="item.id" :value="item.id" :label="item.unit"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="goodsNum" label="商品数量">
				<el-input-number v-model.number="Form.goodsNum" :min="0" :step="1" :precision="2" @change="editGoodsNum('goodsNum')"></el-input-number>
			</el-form-item>
			<el-form-item prop="isNeedFinance" label="需要金融服务">
				<el-radio-group v-model="Form.isNeedFinance" @change="editGoodsNum('isNeedFinance')">
					<el-radio-button :label="true">是</el-radio-button>
					<el-radio-button :label="false">否</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="financePayNum" label="金融支付数量">
				<el-input-number
					v-model="Form.financePayNum"
					:disabled="Form.isNeedFinance != true"
					@change="editGoodsNum('financePayNum')"
					:min="0"
					:max="Form.goodsNum"
					:step="1"
					:precision="2"
				></el-input-number>
			</el-form-item>
			<el-form-item prop="cashPayNum" label="现金支付数量">
				<el-input-number v-model="Form.cashPayNum" :min="0" :max="Form.goodsNum" @change="editGoodsNum('cashPayNum')" :step="1" :precision="2"></el-input-number>
			</el-form-item>
			<el-form-item prop="isNowRelease" label="是否立即发货">
				<el-radio-group v-model="Form.isNowRelease">
					<el-radio-button :label="true">是</el-radio-button>
					<el-radio-button :label="false">否</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="endTime" label="最迟发货时间">
				<el-date-picker
					v-model="Form.endTime"
					type="datetime"
					value-format="yyyy-MM-dd hh:mm:ss"
					placeholder="选择日期"
					:disabled="Form.isNowRelease != true"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="userShopId" label="供货商品品牌">
				<el-select v-model="Form.userShopId" filterable>
					<el-option v-for="item in selectPropagateList" :key="item.id" :value="item.id" :label="item.photoName"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="goodsProductAddress" label="产地"><el-input v-model="Form.goodsProductAddress"></el-input></el-form-item>
			<el-form-item prop="goodsDetailAddress" label="详细收货地址">
				<el-input
					type="textarea"
					:autosize="{ minRows: 4, maxRows: 6 }"
					:maxlength="50"
					show-word-limit
					v-model="Form.goodsDetailAddress"
					placeholder="请输入内容"
				></el-input>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" :maxlength="50" show-word-limit v-model="Form.remark" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item prop="goodsInfoRichText" label="富文本描述">
				<!-- <el-button @click="$refs['Editor'].startEditor()">打开富文本</el-button> -->
				<WangEditor ref="Editor" v-model="Form.goodsInfoRichText" />
			</el-form-item>

			<el-form-item prop="goodsTitleImage" label="商品标题图片">
				<UploadImg ref="UploadGoodsTitleImage" moduleName="web" :limit="1" v-model="Form.goodsTitleImage"></UploadImg>
			</el-form-item>
			<el-form-item prop="goodsImageList" label="图片列表">
				<UploadImg ref="UploadGoodsImageList" moduleName="web" :limit="5" v-model="Form.goodsImageList"></UploadImg>
			</el-form-item>
			<!-- 	<el-form-item prop="status" label="商品状态">
				
			</el-form-item> -->
		</el-form>
		<!-- {{Form}} -->
		<template slot="footer">
			<el-button @click="close()">取消</el-button>
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import Api from '@/api/nzjc/cgGoods.js';
import FormUtil from '@/utils/formUtil.js';

import UploadImg from '@/components/UploadImg/index.vue';
import FormDialog from '@/components/FormDialog/index.vue';
import WangEditor from '@/components/WangEditor/index.vue';
export default {
	props: {
		selectGoodsWeightType: {
			type: Array,
			required: true
		},
		selectGoodsType: {
			type: Array,
			required: true
		},
		selectPropagateList: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			formName: 'EditGhGoodForm',
			show: false,
			id: '',
			Form: {
				cooperativeInfoId: '', //	合作社ID(需要有权限))		false	integer(int32)
				goodsTypeId: '', //	商品类型ID		true	integer(int32)
				goodsWeightTypeId: '', //	采购商品计重单位ID		true	integer(int32)
				userShopId: '', //	采购商品-品牌馆ID		false	integer(int32)
				cashPayNum: '', //	现金支付数量		false	string
				endTime: '', //	最迟发货时间		false	string
				financePayNum: '', //	金融支付数量		false	string
				goodsDetailAddress: '', //	采购商品-详细收货地址		false	string
				goodsImageList: '', //	采购商品-图片列表		false	string
				goodsInfoRichText: '', //	富文本描述		false	string
				goodsName: '', //	采购商品名称		true	string
				goodsNum: '', //	采购商品数量		true	string
				goodsProductAddress: '', //	采购商品-产地		false	string
				goodsTitleImage: '', //	采购商品标题图片		true	string
				isNeedFinance: false, //	是否需要金融服务		false	boolean
				isNowRelease: false, //	是否立即发货		false	boolean
				remark: '' //	备注		false	string
				// status: '' //	采购商品状态		false	integer(int32)
			},
			Rules: {
				cooperativeInfoId: [{ required: true, message: '请选择合作社', trigger: 'blur' }], //	合作社ID(需要有权限))		false	integer(int32)
				goodsTypeId: [{ required: true, message: '请选择', trigger: 'change' }], //	商品类型ID		true	integer(int32)
				goodsWeightTypeId: [{ required: true, message: '请选择计重单位', trigger: 'change' }], //	采购商品计重单位ID		true	integer(int32)
				userShopId: [{ required: true, message: '请选择品牌', trigger: 'change' }], //	采购商品-品牌馆ID		false	integer(int32)
				cashPayNum: [{ required: true, message: '请输入', trigger: 'blur' }], //	现金支付数量		false	string
				endTime: [
					{
						validator: (rule, value, callback) => {
							!!!value && callback();
							if (this.Form.isNowRelease) {
								return callback(new Error('请输入填写正确日期'));
							} else {
								callback();
							}
						},
						required: true,
						trigger: 'change'
					}
				], //	最迟发货时间		false	string
				financePayNum: [{ required: true, message: '请输入', trigger: 'blur' }], //	金融支付数量		false	string
				goodsDetailAddress: [{ required: true, message: '请输入', trigger: 'blur' }], //	采购商品-详细收货地址		false	string
				goodsImageList: [
					{
						validator: (rule, value, callback) => {
							let FileList = this.$refs['UploadGoodsImageList'].getFileList();
							if (FileList.length <= 0) {
								return callback(new Error('请上传图片'));
							} else {
								callback();
							}
						},
						required: true,
						trigger: 'change'
					}
				], //	采购商品-图片列表		false	string
				goodsInfoRichText: [{ required: true, message: '请输入描述', trigger: 'change' }], //	富文本描述		false	string
				goodsName: [{ required: true, message: '请输入', trigger: 'blur' }], //	采购商品名称		true	string
				goodsNum: [
					{ required: true, message: '请输入', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							if (value <= 0) {
								return callback(new Error('请输入商品数量'));
							} else {
								callback();
							}
						},
						trigger: 'change'
					}
				], //	采购商品数量		true	string
				goodsProductAddress: [{ required: true, message: '请输入', trigger: 'blur' }], //	采购商品-产地		false	string
				goodsTitleImage: [{ required: true, message: '请上传图片', trigger: 'change' }], //	采购商品标题图片		true	string
				isNeedFinance: [{ required: true, message: '请选择', trigger: 'blur' }], //	是否需要金融服务		false	boolean
				isNowRelease: [{ required: true, message: '请选择', trigger: 'blur' }], //	是否立即发货		false	boolean
				remark: [{ required: true, message: '请输入内容', trigger: 'blur' }] //	备注		false	string
				// status: [{ required: true, message: '请选择', trigger: 'blur' }] //	采购商品状态		false	integer(int32)
			},
			selectChargePeriodType: [{ id: '1', name: '类型1' }, { id: '2', name: '类型2' }],
			selectLogisticsChargeType: [{ id: '1', name: '类型1' }, { id: '2', name: '类型2' }]
		};
	},
	components: {
		FormDialog,
		UploadImg,
		WangEditor
	},
	computed: {
		dialogTitle() {
			return (this.isAdd ? '录入' : '修改') + '采购商品';
		},
		isAdd() {
			return !this.id;
		}
	},
	mounted() {
		this.$refs['Editor'].startEditor();
	},
	methods: {
		editGoodsNum(type) {
			// console.log(val)
			let types = ['goodsNum', 'financePayNum', 'cashPayNum', 'isNeedFinance'];
			if (types.includes(type) != true) return;
			let isNeedFinance = this.Form.isNeedFinance; //是否使用金融支付
			if (isNeedFinance) {
				let goodsNum = this.Form.goodsNum;
				let financePayNum = this.Form.financePayNum; //金融支付数量
				let cashPayNum = this.Form.cashPayNum; //现金支付数量
				if (types[0] == type || types[1] == type) {
					cashPayNum = goodsNum - financePayNum;
					this.Form.cashPayNum = cashPayNum;
					if (cashPayNum <= 0) {
						this.Form.financePayNum = goodsNum;
					}
				} else if (types[2] == type) {
					console.log(type);
					financePayNum = goodsNum - cashPayNum;
					this.Form.financePayNum = financePayNum;
				}
			} else {
				this.Form.financePayNum = 0;
				this.Form.cashPayNum = this.Form.goodsNum;
			}
		},
		open(row) {
			this.show = true;
			this.$nextTick(() => {
				this.$refs['Editor'].startEditor();
				if (row) {
					this.Form = FormUtil.combineAttrs(this.Form, row);
				}
			});
		},
		close() {
			this.$refs['Editor'].destroyEditor();
			this.emptyForm(this.formName);
			this.show = false;
		},
		async submit() {
			this.validateForm(this.formName).then(async () => {
				let goodsImageList = await this.$refs['UploadGoodsImageList'].uploadImg();
				this.Form.goodsImageList = JSON.stringify(goodsImageList)
				let params = {
					...this.Form
				};
				let res;
				!this.Form.propagatePhotoId ? (res = await Api.addGood(params)) : (res = await Api.updateGoodById(this.id, params));
				let { code, data, msg } = res;
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
<style lang="scss" scoped="scoped"></style>
