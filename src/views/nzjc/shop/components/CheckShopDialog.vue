<template>
	<FormDialog ref="FormDialog" title="审核店铺" width="800px" top="12vh" v-model="show" :drag="false">
		{{Form}}
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="7rem">
			<el-form-item prop="result" label="审核结果">
				<el-radio-group v-model="Form.result">
					<el-radio-button :label="true">通过</el-radio-button>
					<el-radio-button :label="false">不通过</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="resultExplain" label="审核结果说明">
				<el-input 
					type="textarea" 
					:autosize="{ minRows: 8, maxRows: 12 }" 
					placeholder="请输入内容" 
					v-model="Form.resultExplain"
				></el-input>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<el-button @click="close()">取消</el-button>
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import Api from '@/api/nzjc/shop.js';
import FormUtil from '@/utils/formUtil.js';

import FormDialog from '@/components/FormDialog/index.vue';
export default {
	data() {
		return {
			formName: 'CheckShopForm',
			show: false,
			shopId: '', //	品牌馆ID	query	true	integer(int32)
			Form: {
				result: false, //	审核结果:true -- 通过 false -- 不通过	query	true	boolean
				resultExplain: '' //	审核结果说明	query	true	string
			},
			Rules: {}
		};
	},
	components: {
		FormDialog
	},
	methods: {
		open(row) {
			console.log(row);
			if (!row) return;
			this.show = true;
			this.shopId = row.id;
		},
		close() {
			this.shopId = '';
			this.emptyForm(this.formName);
			this.show = false;
		},
		async submit() {
			this.validateForm(this.formName).then(async () => {
				let params = {
					...this.Form,
					shopId: this.shopId
				};
				let { code, data, msg } = await Api.setShopCheck(params);
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
		}
	}
};
</script>
