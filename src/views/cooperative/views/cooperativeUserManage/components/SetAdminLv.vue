<template>
	<FormDialog ref="FormDialog" title="修改用户" width="400px" top="300px" v-model="show" append-to-body>
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="120px">
			<el-form-item prop="adminLv" label="管理员等级">
				<el-select v-model="Form.adminLv"><el-option v-for="item in selectAdminLv" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
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
import ApiCooperativeUser from '@/api/nzjc/cooperativeUserManage.js';
import FormUtil from '@/utils/formUtil.js';
import selectMixin from "../selectMixin.js"
// import mixin from "./mixin.js"

import FormDialog from '@/components/FormDialog/index.vue';
import FormEmailInput from '@/components/FormEmailInput/index.vue';
export default {
	mixins:[selectMixin],
	data() {
		return {
			formName:"UpdateRoleForm",
			show:false,
			id:'',//用户ID
			Form: {
				adminLv:'',
			},
			Rules:{
				adminLv: [{ required: true, message: '不能为空', trigger: 'blur' }],
			},
			selectAdminLv: [{ value: 0, label: '普通成员' }, { value: 1, label: '一级管理员' }, { value: 2, label: '二级管理员' }],
		};
	},
	// mixins:[
	// 	mixin
	// ],
	props: {
		selectRole: {
			type: Array
		}
	},
	components: {
		FormEmailInput,
		FormDialog
	},
	methods: {
		open(id,lv) {
			console.log(id,lv)
			this.$nextTick(()=>{
				this.id = id;
				this.Form.adminLv = lv;
			})
			this.show = true;
		},
		close() {
			this.show = false;
		},
		submit() {
			this.validateForm(this.formName).then(async res => {
				// let params = FormUtil.filterHasValue(this.Form);
				let params = {
					...this.Form
				};
				let { code, data, msg } = await ApiCooperativeUser.setUserAsAdminById(this.id,params);
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				// this.emptyForm(this.formName);
				this.close()
				this.$emit('success');
			} else {
				this.$message.warning(`warning:${ErrorMsg}`);
			}
		},
	}
};
</script>
<style lang="scss" scoped="scoped">
.el-form {
	padding-right: 2rem;
}
</style>
