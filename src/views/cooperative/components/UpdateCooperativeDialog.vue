<template>
	<FormDialog ref="FormDialog" title="修改合作社" width="500px" top="12vh" v-model="show" :drag="false" @closed="close">
		<!-- :drag="false" -->
		{{cooperativeId}}
		{{Form}}
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="140px" >
			<el-divider content-position="left">合作社</el-divider>
			<el-form-item prop="pId" label="父级合作社"><el-input v-model="Form.pId"></el-input></el-form-item>
			<el-form-item prop="cooperativeLv" label="合作社等级">
				<el-select v-model="Form.cooperativeLv">
					<el-option v-for="item in selectCooperativeLv" :key="item.value" :value="item.value" :label="item.label"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="cityNo" label="所在城市"><SelectAddress ref="SelectAddress" v-model="Form.cityNo"></SelectAddress></el-form-item>
			<el-form-item prop="address" label="通讯地"><el-input v-model="Form.address"></el-input></el-form-item>
			<el-form-item prop="mcc" label="经营类目"><el-input v-model="Form.mcc"></el-input></el-form-item>
			<el-form-item prop="name" label="合作社名称"><el-input v-model="Form.name"></el-input></el-form-item>
			<el-form-item prop="licenseCode" label="营业执照编号"><el-input v-model="Form.licenseCode"></el-input></el-form-item>
			<el-divider content-position="left">联系人</el-divider>
			<el-form-item prop="contactCertificationNo" label="联系人身份证号码"><el-input v-model="Form.contactCertificationNo"></el-input></el-form-item>
			<el-form-item prop="contactName" label="联系人姓名"><el-input v-model="Form.contactName"></el-input></el-form-item>
			<el-form-item prop="contactPhoneNo" label="联系人电话号码"><el-input v-model="Form.contactPhoneNo"></el-input></el-form-item>
			<el-divider content-position="left">法人</el-divider>
			<el-form-item prop="certificationNo" label="身份证号码"><el-input v-model="Form.certificationNo"></el-input></el-form-item>
			<el-form-item prop="phoneNo" label="联系电话"><el-input v-model="Form.phoneNo"></el-input></el-form-item>
			<el-form-item prop="realName" label="法人真实姓名"><el-input v-model="Form.realName"></el-input></el-form-item>
		</el-form>
		<template slot="footer">
			<el-button @click="show = false">取消</el-button>
			<el-button type="warning" @click="empty">重置表单</el-button>
			<!-- <el-button type="warning" @click="emptyForm(formName)">重置表单</el-button> -->
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import ApiCooperative from '@/api/nzjc/cooperativeManage.js';
import FormUtil from '@/utils/formUtil.js';
import selectMixin from "../selectMixin.js"

// import mixin from "./mixin.js"
import SelectAddress from '@/components/SelectAddress/cascader.vue';
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	mixins:[selectMixin],
	data() {
		return {
			cooperativeId:"",
			formName:"EditCooperativeForm",
			show:false,
			Form: {
				pId:"",//	父级合作社ID	query	false	integer(int32)
				address:"",//	详细地址	query	false	string
				certificationNo:"",//	身份证号码	query	false	string
				cityNo:[],//	所属城市	query	false	string
				contactCertificationNo:"",//	联系人身份证号码	query	false	string
				contactName:"",//	联系人姓名	query	false	string
				contactPhoneNo:"",//	联系人电话号码	query	false	string
				cooperativeLv:"",//	合作社等级（0村级 1县级）	query	false	integer(int32)
				licenseCode:"",//	营业执照编号	query	false	string
				mcc:"",//	经营类目	query	false	string
				name:"",
				phoneNo:"",//	联系电话	query	false	string
				realName:"",//	法人真实姓名	query	false	string
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
		SelectAddress,
	},
	computed:{
		editType() {
			return !!this.cooperativeId;
		},
	},
	mounted() {
	},
	methods: {
		open(row) {
			if(row) {
				this.$nextTick(async ()=>{
					this.cooperativeId = row.id;
					this.Form = FormUtil.combineAttrs(this.Form,row);

					// let data = this.Form.cityNo.split(',');
					let data = row.cityNo.split(',');
					// console.log(data)
					// await this.$refs['SelectAddress'];
					this.$refs['SelectAddress'].startData(data);
					console.log();
				})
			}
			this.show = true;
		},
		close() {
			this.cooperativeId = "";
			// this.$refs['SelectAddress'].startData([]);
			// this.emptyForm(this.formName);
			this.empty();
			// this.show = false;
		},
		empty() {
			this.emptyForm(this.formName).then(res=>{
				this.$refs['SelectAddress'].startData([]);
			});
			// for (let i in this.Form) {
			// 	this.Form[i] = '';
			// }
		},
		submit() {
			this.validateForm(this.formName).then(async res => {
				let params = {
					...this.Form,
				};
				if(typeof(params['cityNo']) == "object") {
					params['cityNo'] = params['cityNo'].join(',');
				}

				let { code, data, msg } = await ApiCooperative.updateBaseInfoById(this.cooperativeId,params);
				// let { code, data, msg } = await ApiCooperative.addBaseInfo(params);
				// ApiCooperative.updateBaseInfoById(this.cooperativeId,params)
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				// this.emptyForm(this.formName);
				// this.empty();
				// this.close();
				this.show = false;
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
