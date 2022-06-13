<template>
	<FormDialog ref="FormDialog" title="修改用户" width="500px" top="300px" v-model="show">
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="6rem">
			<el-form-item prop="roleName" label="角色名称"><el-input v-model="Form.roleName" /></el-form-item>
			<el-form-item prop="remark" label="角色描述">
				<el-input
				  type="textarea"
				  :autosize="{ minRows: 2, maxRows: 4}"
				  placeholder="请输入内容"
				  v-model="Form.remark">
				</el-input>
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
import ApiRole from '@/api/system/role.js';
import FormUtil from '@/utils/formUtil.js';

// import mixin from "./mixin.js"

import FormDialog from '@/components/FormDialog/index.vue';
import FormEmailInput from '@/components/FormEmailInput/index.vue';
export default {
	data() {
		return {
			formName:"UpdateRoleForm",
			show:false,
			id:'',//用户ID
			Form: {
				roleName: '',
				remark: '',
			},
			Rules:{
				roleName: [{ required: true, message: '不能为空', trigger: 'blur' }],
				remark: [{ required: true, message: '不能为空', trigger: 'blur' }],
			},
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
		open(row) {
			console.log(row)
			this.id = row.id;
			this.Form = FormUtil.combineAttrs(this.Form,row);
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
				let { code, data, msg } = await ApiRole.updateRoleById(this.id,params);
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				this.emptyForm(this.formName);
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
