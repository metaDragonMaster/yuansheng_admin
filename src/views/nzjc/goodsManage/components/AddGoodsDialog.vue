<template>
	<FormDialog ref="FormDialog" title="添加商品" width="500px" top="12vh" v-model="show" :drag="false">
		<!-- :drag="false" -->
		{{ Form }}
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="100px">
			<el-form-item prop="name" label="商品名称"><el-input v-model="Form.name"></el-input></el-form-item>
			<el-form-item prop="price" label="商品价格"><el-input v-model="Form.price"></el-input></el-form-item>
			<el-form-item prop="goodsTypeId" label="商品类型">
				<!-- <el-select v-model="Form.goodsTypeId">
					<el-option v-for="item in selectGoodsType" :></el-option>
				</el-select> -->
				<el-cascader v-model="Form.goodsTypeId" :options="selectGoodsType" :props="option"></el-cascader>
			</el-form-item>
			<el-form-item prop="goodsPsTypeId" label="配送方式">
				<el-select v-model="Form.goodsPsTypeId">
					<el-option v-for="item in selectGoodsPsType" :key="item.id" :value="item.id" :label="item.psDesc"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="goodsWeightTypeId" label="商品规格">
				<el-select v-model="Form.goodsWeightTypeId">
					<el-option v-for="item in selectGoodsWeightType" :key="item.id" :value="item.id" :label="item.unit"></el-option>
				</el-select>
			</el-form-item>
			<!-- <el-form-item prop="goodsComposeId" label="商品组合"></el-form-item> -->
		</el-form>
		<template slot="footer">
			<el-button @click="close()">取消</el-button>
			<el-button type="warning" @click="emptyForm(formName)">重置表单</el-button>
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import Api from '@/api/nzjc/goodsManage.js';
import ApiGoodsType from '@/api/nzjc/goodsType.js';
import ApiGoodsWeightType from '@/api/nzjc/goodsWeightType.js';
import ApiGoodsPsType from '@/api/nzjc/goodPsType.js';
import FormUtil from '@/utils/formUtil.js';
// import selectMixin from "../selectMixin.js"

import SelectAddress from '@/components/SelectAddress/cascader.vue';
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	// mixins:[selectMixin],
	data() {
		return {
			formName: 'AddGoodsForm',
			show: false,
			Form: {
				goodsComposeId: '', //	商品组合ID	query	false	integer(int32)
				goodsPsTypeId: '', //	配送方式	query	false	integer(int32)
				goodsTypeId: '', //	产品类型ID	query	false	integer(int32)
				goodsWeightTypeId: '', //	产品规格类型ID	query	false	integer(int32)
				merchantId: '', //	商家ID	query	false	 integer(int32)
				name: '', //	商品名称	query	false	string
				price: '' //	商品价格	query	false	string
			},
			Rules: {},
			option: {
				lazy: true,
				lazyLoad: this.lazyLoad,
				value:"id",
				label:"name"
			},
			selectGoodsType: [],
			selectGoodsWeightType: [],
			selectGoodsPsType: []
		};
	},
	props: {
		selectRole: {
			type: Array
		}
	},
	components: {
		FormDialog,
		SelectAddress
	},
	mounted() {
		this.getAllSelectArray();
	},
	methods: {
		open(row) {
			console.log(row);
			this.show = true;
			if (row) {
				// this.Form = FormUtil.combineAttrs(this.Form,row);
			}
		},
		close() {
			this.emptyForm(this.formName);
			this.show = false;
		},
		submit() {
			this.validateForm(this.formName).then(async res => {
				let params = {
					...this.Form
				};
				let { code, data, msg } = await Api.addGoods(params);
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				this.emptyForm(this.formName);
				this.close();
				this.$emit('success');
			} else {
				this.$message.warning(`warning:${ErrorMsg}`);
			}
		},
		async getAllSelectArray() {
			this.selectGoodsType = await this.getGoodsType();
			let Weight = await ApiGoodsWeightType.getGoodsWeightType();
			this.selectGoodsWeightType = Weight.data;
			let psType = await ApiGoodsPsType.getGoodsPsType();
			this.selectGoodsPsType = psType.data;
		},
		async lazyLoad(node, resolve) {
			console.log(node);
			const { level, value } = node;
			const data = await this.getGoodsType(value);
			console.log(data);
			const nodes = this.setUpMccOptions(data);
			resolve(nodes);
			// resolve(node);
		},
		async getGoodsType() {
			let {data} = await ApiGoodsType.getGoodsType();
			return data;
		},
		setUpMccOptions(data) {
			return data.map(item => ({
				id: item.id,
				name: item.name,
				lv: item.lv >= 3
			}));
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
