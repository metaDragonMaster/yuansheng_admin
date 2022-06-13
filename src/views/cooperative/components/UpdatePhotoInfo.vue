<template>
	<FormDialog ref="FormDialog" title="修改合伙企业证件照表单" width="800px" top="12vh" v-model="show" :drag="false">
		<!-- :drag="false" -->
		{{Form}}
		<el-form :ref="formName" :model="Form" :rules="Rules" inline label-position="right" label-width="140px" >
			<el-form-item prop="bankCardFrontPhoto" label="银行卡正面">
				<uploadImg
					moduleName="web"
					ref="bankCardFrontPhoto"
					v-model="Form.bankCardFrontPhoto"
				></uploadImg>
			</el-form-item>
			<el-form-item prop="licenseCodePhoto" label="营业执照">
				<uploadImg
					moduleName="web"
					ref="licenseCodePhoto"
					v-model="Form.licenseCodePhoto"
				></uploadImg>
			</el-form-item>
			<el-form-item prop="legalCertificationFrontPhoto" label="法人身份证正面">
				<uploadImg
					moduleName="web"
					ref="legalCertificationFrontPhoto"
					tipText="正面照"
					v-model="Form.licenseCodePhoto"
				></uploadImg>
			</el-form-item>
			<el-form-item prop="legalCertificationBackPhoto" label="法人身份证反面">
				<uploadImg
					moduleName="web"
					ref="legalCertificationBackPhoto"
					tipText="反面照"
					v-model="Form.licenseCodePhoto"
				></uploadImg>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<el-button @click="close()">取消</el-button>
			<el-button type="warning" @click="emptyForm(formName)">重置表单</el-button>
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
import UploadImg from '@/components/UploadImg/index.vue';
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	mixins:[selectMixin],
	data() {
		return {
			cooperativeId:"",
			formName:"UpdatePhotoInfoForm",
			show:false,
			// Form: {
			// 	bankCardFrontPhoto: '', //			银行卡正面	false	string
			// 	licenseCodePhoto: '', //			营业执照		false	string
			// 	legalCertificationBackPhoto: '', //	法人身份证反面		false	string
			// 	legalCertificationFrontPhoto: '' //	法人身份证正面		false	string
			// },
			Form: { "bankCardFrontPhoto": "https://web.yuanshengl.com/web/image/1632386562450_d5e66c61eb532c09cbdf02b96107cb59.jpg", "licenseCodePhoto": "https://web.yuanshengl.com/web/image/1632386567511_e19857172a6f52368d495051b742f547.jpg", "legalCertificationBackPhoto": "https://web.yuanshengl.com/web/image/1632386578064_c283cfae22897e18ec28efba7fae2f0c.png", "legalCertificationFrontPhoto": "https://web.yuanshengl.com/web/image/1632386574412_cf2216c6e5bcaf0badf0058c76ca8bfd.png" },
			Rules:{

			},

		};
	},
	props: {
		selectRole: {
			type: Array
		},
	},
	components: {
		FormDialog,
		UploadImg,
	},
	methods: {
		open(row) {
			this.show = true;
			if(row) {
				this.$nextTick(async ()=>{
					this.cooperativeId = row.id;
					this.Form = FormUtil.combineAttrs(this.Form,row);
					this.$refs['bankCardFrontPhoto'].setFileList(this.Form.bankCardFrontPhoto||[]);
					this.$refs['licenseCodePhoto'].setFileList(this.Form.licenseCodePhoto||[]);
					this.$refs['legalCertificationBackPhoto'].setFileList(this.Form.legalCertificationBackPhoto||[]);
					this.$refs['legalCertificationFrontPhoto'].setFileList(this.Form.legalCertificationFrontPhoto||[]);
				})
			}
		},
		close() {
			this.cooperativeId = "";
			this.emptyForm(this.formName);
			this.$refs['bankCardFrontPhoto'].setFileList([]);
			this.$refs['licenseCodePhoto'].setFileList([]);
			this.$refs['legalCertificationBackPhoto'].setFileList([]);
			this.$refs['legalCertificationFrontPhoto'].setFileList([]);
			this.show = false;
		},
		submit() {
			this.validateForm(this.formName).then(async res => {
				let params = {
					...this.Form,
				};
				let { code, data, msg } = await ApiCooperative.updatePhotoInfoById(this.cooperativeId,params);
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
