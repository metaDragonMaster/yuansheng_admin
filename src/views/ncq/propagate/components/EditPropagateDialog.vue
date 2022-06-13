<template>
	<FormDialog ref="FormDialog" :title="dialogTitle" width="800px" top="12vh" v-model="show" :drag="false">
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="7rem">
			<el-form-item prop="photoName" label="宣传图名称"><el-input v-model="Form.photoName"></el-input></el-form-item>
			<el-form-item prop="photoType" label="宣传图类型">
				<el-select v-model="Form.photoType">
					<el-option v-for="item in selectPhotoType" :key="item.value" :value="item.value" :label="item.label"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="photoUrl" label="宣传图地址">
				<p>{{Form.photoUrl}}</p>
				<UploadImg ref="UploadImage" moduleName="web" v-model="Form.photoUrl"></UploadImg>
			</el-form-item>
			<el-form-item v-show="Form.photoType == 1" :prop="Form.photoType == 1?'redirectUrl':''" label="跳转地址"><el-input v-model="Form.redirectUrl"></el-input></el-form-item>
		</el-form>
		<template slot="footer">
			<el-button @click="close()">取消</el-button>
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import Api from '@/api/ncq/propagate.js';
import FormUtil from '@/utils/formUtil.js';

import UploadImg from "../../../../components/UploadImg/index.vue"
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	data() {
		return {
			formName: 'EditPropagateForm',
			show: false,
			Form: {
				propagatePhotoId:"",//	宣传图ID	query	true	integer(int32)
				photoName:"",//	宣传图名称	query	true	string
				photoType:"",//	宣传图类型	query	true	integer(int32)
				photoUrl:"",//	宣传图地址	query	true	string
				redirectUrl:"",//	跳转地址	query	true	string
			},
			Rules: {
				photoName:[{ required: true, message: '请输入宣传图名称', trigger: 'blur' }],//	宣传图名称	query	true	string
				photoType:[{ required: true, message: '请输入宣传图类型', trigger: 'blur' }],//	宣传图类型	query	true	integer(int32)
				photoUrl:[{ required: true, message: '请输入宣传图地址', trigger: 'change' }],//	宣传图地址	query	true	string
				redirectUrl:[{ required: true, message: '请输入跳转地址', trigger: 'blur' }],//	跳转地址	query	true	string
			},
			selectPhotoType:[
				{value:0,label:"不跳转商品页面"},
				{value:1,label:"跳转商品页面"},
			],
		};
	},
	components: {
		FormDialog,
		UploadImg
	},
	computed:{
		dialogTitle() {
			return (this.isAdd? '新增':'修改') + '宣传图'
		},
		isAdd() {
			return !this.Form.propagatePhotoId
		}
	},
	methods: {
		open(row) {
			this.show = true;
			if (row) {
				this.Form.propagatePhotoId = row.id;
				this.$nextTick(()=>{
					this.Form = FormUtil.combineAttrs(this.Form, row);
					this.$refs['UploadImage'].setFileList(row.photoUrl);
				})
			}
		},
		close() {
			this.emptyForm(this.formName);
			this.$refs['UploadImage'].removeFileList();
			this.Form.propagatePhotoId = "";
			this.show = false;
		},
		async submit() {
			this.validateForm(this.formName).then(async () => {
				if(this.Form.photoType != 1) {
					this.Form.redirectUrl = '';
				}
				let params = {
					...this.Form,
				};
				let res;
				!this.Form.propagatePhotoId?res = await Api.addPropagate(params):res = await Api.updatePropagate(params);
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
// .el-input {
// 	width: fit-content;
// }
</style>
