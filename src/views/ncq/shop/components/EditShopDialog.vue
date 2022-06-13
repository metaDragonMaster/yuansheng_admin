<template>
	<FormDialog ref="FormDialog" :title="dialogTitle" width="800px" top="12vh" v-model="show" :drag="false">
<!-- 		{{ shopId }}
		{{ Form }} -->
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="7rem">
			<el-form-item label="商户ID" v-if="isAdd">
				<div class="flex">
					<p v-if="!!user&&user!=''" class="user-show">
						<span>{{user.realName}}</span>
						<span>{{user.mobile}}</span>
						<span>{{user.idNumber}}</span>
					</p>
					<el-button type="primary" @click="$refs['SelectUserDialog'].open()">选择商户</el-button>
				</div>
			</el-form-item>
			<el-form-item prop="shopName" label="品牌馆名称"><el-input v-model="Form.shopName"></el-input></el-form-item>
			<el-form-item prop="mainBusiness" label="主营"><el-input v-model="Form.mainBusiness"></el-input></el-form-item>
			<el-form-item prop="regionId" label="地域">
				<SelectAddress ref="SelectAddress" type="string" v-model="Form.regionId"></SelectAddress>
			</el-form-item>
			<el-form-item prop="introduction" label="介绍">
				<el-input type="textarea" :autosize="{ minRows: 8, maxRows: 16 }" v-model="Form.introduction" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item prop="squareImageSmall" label="小图--品牌图标（方形）">
				<UploadImg ref="uploadSquareImageSmall" moduleName="web" v-model="Form.squareImageSmall"></UploadImg>
			</el-form-item>
			<el-form-item prop="circleImageSmall" label="小图--品牌图标（圆形）">
				<UploadImg ref="uploadCircleImageSmall" moduleName="web" v-model="Form.circleImageSmall"></UploadImg>
			</el-form-item>
			<el-form-item prop="imageList" label="图片列表">
				<UploadImg ref="uploadImageList" moduleName="web" :limit="5"></UploadImg>
			</el-form-item>
		</el-form>
		<SelectUserDialog ref="SelectUserDialog" @success="selectUser" ></SelectUserDialog>
		<template slot="footer">
			<el-button @click="close()">取消</el-button>
			<el-button type="warning" @click="emptyForm(formName)">重置表单</el-button>
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import Api from '@/api/ncq/shop.js';
import FormUtil from '@/utils/formUtil.js';

import SelectAddress from '@/components/SelectAddress/cascader.vue';
import UploadImg from '@/components/UploadImg/index.vue';
import FormDialog from '@/components/FormDialog/index.vue';
import SelectUserDialog from "./SelectUserDialog.vue";
export default {
	data() {
		return {
			formName: 'EditShopForm',
			show: false,
			user:'',
			shopId:"",
			Form: {
				circleImageSmall: '', //小图--品牌图标（圆形）	query	false	string
				imageList: [], //	图片列表	query	false	string
				introduction: '', //	介绍	query	false	string
				mainBusiness: '', //	主营	query	false	string
				regionId: '', //	地域ID	query	false	integer(int32)
				shopName: '', //	品牌馆名称	query	false	string
				squareImageSmall: '' //	小图--品牌图标（方形）	query	false	string
			},
			Rules: {},
		};
	},
	components: {
		FormDialog,
		UploadImg,
		SelectAddress,
		SelectUserDialog,
	},
	computed:{
		isAdd() {
			return !this.shopId
		},
		dialogTitle() {
			return this.isAdd? '添加店铺' :'修改店铺'
		}
	},
	methods: {
		selectUser(row) {
			this.user = {
				...row
			}
		},
		open(row) {
			this.show = true;
			if (row) {
				console.log('row--->',row);
				this.shopId = row.id;
				this.$nextTick(() => {
					this.Form = FormUtil.combineAttrs(this.Form, row);
					this.$refs['uploadSquareImageSmall'].setFileList(row.squareImageSmall);
					this.$refs['uploadCircleImageSmall'].setFileList(row.circleImageSmall);
					this.$refs['uploadImageList'].setFileList(row.imageList);
				});
			}
		},
		close() {
			this.$refs['uploadSquareImageSmall'].removeFileList();
			this.$refs['uploadCircleImageSmall'].removeFileList();
			this.$refs['uploadImageList'].removeFileList();
			this.user = '';
			this.emptyForm(this.formName);
			this.show = false;
		},
		async submit() {
			this.Form.imageList = await this.$refs['uploadImageList'].uploadImg();
			this.validateForm(this.formName).then(async () => {
				let params = {
					...this.Form,
				};
				if(this.isAdd) {
					params.userId = this.user.id;
					let { code, data, msg } = await Api.addShop(params);
					this.success(code, msg);
				} else {
					params.shopId = this.shopId;
					let { code, data, msg } = await Api.updateShop(params);
					this.success(code, msg);
				}
				
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
<style lang="scss" scoped="scoped">
.user-show {
	background-color: #e8e8e8;
	border-radius: 0.5rem;
	padding: 0.25rem 0.75rem;
	display: flex;
	margin-right: 1rem;
	span:not(:last-child) {
		margin-right: 1rem;
	}
}
</style>
