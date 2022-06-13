<template>
	<FormDialog ref="FormDialog" title="合作社银行信息提交表单" width="500px" top="12vh" v-model="show" :drag="false">
		<!-- :drag="false" -->
		<!-- <p>{{'cooperativeId:' + cooperativeId}}</p> -->
		<!-- <p>{{Form}}</p> -->
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="140px" >
			<el-form-item prop="bankName" label="开户行">
				<!-- <el-input v-model="Form.bankName"></el-input> -->
				<selectBank v-model="Form.bankName" ref="selectBank"></selectBank>
			</el-form-item>
			<el-form-item prop="bankNo" label="银行卡号码">
				<el-input v-model="Form.bankNo"></el-input>
			</el-form-item>
			<el-form-item prop="bankPhoneNo" label="开户预留手机号">
				<el-input v-model="Form.bankPhoneNo"></el-input>
			</el-form-item>
			<el-form-item prop="bankUserName" label="银行卡开户人名字">
				<el-input v-model="Form.bankUserName"></el-input>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<el-button @click="close()">取消</el-button>
			<!-- <el-button type="warning" @click="empty">重置表单</el-button> -->
			<el-button type="warning" @click="emptyForm(formName)">重置表单</el-button>
			<!-- emptyForm(formName); -->
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import ApiCooperative from '@/api/nzjc/cooperativeManage.js';
import FormUtil from '@/utils/formUtil.js';
import selectMixin from "../selectMixin.js"

// import mixin from "./mixin.js"
// import SelectAddress from '@/components/SelectAddress/cascader.vue';
import selectBank from "../modules/selectBank.vue";
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	mixins:[selectMixin],
	data() {
		return {
			cooperativeId:"",
			formName:"UpdateBankInfoForm",
			show:false,
			// Form: {
			// 	bankName:"",//	开户行	query	true
			// 	bankNo:"11112222",//	银行卡号码	query	true
			// 	bankPhoneNo:"15554846625",//	开户预留手机号	query	true
			// 	bankUserName:"王小二",//	银行卡开户人名字	query	true
			// },
			Form: {
				bankName:"",//	开户行	query	true
				bankNo:"",//	银行卡号码	query	true
				bankPhoneNo:"",//	开户预留手机号	query	true
				bankUserName:"",//	银行卡开户人名字	query	true
			},
			Rules:{

			},

		};
	},
	// mixins:[
	// 	mixin
	// ],
	props: {
		selectRole: {
			type: Array
		},
	},
	components: {
		FormDialog,
		selectBank,
		// SelectAddress,
	},
	methods: {
		open(row) {
			this.show = true;
			if(row) {
				this.$nextTick(async ()=>{
					this.cooperativeId = row.id;
					this.Form = FormUtil.combineAttrs(this.Form,row);
					this.$refs['selectBank'].startData(this.Form.bankName);
					this.$refs['selectBank'].selectBankInfo();
					// console.log()
				})
			}
		},
		close() {
			this.cooperativeId = "";
			this.emptyForm(this.formName);
			// this.empty();
			this.show = false;
		},
		// empty() {
		// 	this.$refs['SelectAddress'].startData([]);
		// 	for (let i in this.Form) {
		// 		this.Form[i] = '';
		// 	}
		// },
		submit() {
			this.validateForm(this.formName).then(async res => {
				let params = {
					...this.Form,
				};
				let { code, data, msg } = await ApiCooperative.updateBankInfoById(this.cooperativeId,params);
				// let { code, data, msg } = await ApiCooperative.addBaseInfo(params);
				// ApiCooperative.updateBaseInfoById(this.cooperativeId,params);
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				this.emptyForm(this.formName);
				// this.empty();
				this.close();
				this.$emit('success');
			} else {
				this.$message.warning(`warning:${ErrorMsg}`);
			}
		},
	}
};
</script>
<style lang="scss" scoped="scoped">
</style>
