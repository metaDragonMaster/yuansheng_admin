<template>
	<FormDialog ref="FormDialog" title="添加用户" width="500px" v-model="show">
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="80px">
			<el-form-item prop="username" label="用户名称"><el-input v-model="Form.username" /></el-form-item>
			<el-form-item prop="password" label="用户密码"><el-input v-model="Form.password" show-password /></el-form-item>
			<el-form-item prop="mobile" label="联系电话"><el-input v-model="Form.mobile" /></el-form-item>
			<el-form-item prop="roleIds" label="角色">
				<el-select v-model="Form.roleIds"  filterable multiple collapse-tags>
					<el-option v-for="item in selectRole" :key="item.value" :value="item.value" :label="item.label"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="idNumber" label="身份证号"><el-input v-model="Form.idNumber" /></el-form-item>
			<el-form-item prop="realName" label="真实姓名"><el-input v-model="Form.realName" /></el-form-item>
			<el-form-item prop="deptId" label="部门"><el-input v-model="Form.deptId" /></el-form-item>
			<el-form-item prop="email" label="邮箱">
				<!-- <el-autocomplete v-model="Form.email" :trigger-on-focus="false" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete> -->
				<FormEmailInput v-model="Form.email"></FormEmailInput>
			</el-form-item>
			<el-form-item prop="sex" label="性别">
				<el-select v-model="Form.sex"><el-option v-for="item in selectSex" :key="item.value" :value="item.value" :label="item.label"></el-option></el-select>
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
import ApiUser from '@/api/system/user.js';
import FormUtil from '@/utils/formUtil.js';

import mixin from "./mixin.js"

import FormDialog from '@/components/FormDialog/index.vue';
import FormEmailInput from '@/components/FormEmailInput/index.vue';
export default {
	data() {
		return {
			formName:"AddUserForm",
			show:false,
			Form: {
				mobile: '', //	联系电话	query	false	string
				password: '',
				roleIds: [], //	角色ID	query	false	string
				username: '', //	用户名	query	false	string'
				deptId: '', //	部门ID	query	false	integer(int32)
				email: '', //	邮箱	query	false	string
				idNumber: '', //	身份证号	query	false string
				realName: '', //	真实姓名	query	false	string
				sex: '' //	0=男,1=女,2=保密	query	false	string
			},
			selectSex: [{ value: 0, label: '男' }, { value: 1, label: '女' }, { value: 2, label: '保密' }],
		};
	},
	mixins:[
		mixin
	],
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
		open() {
			this.show = true;
		},
		close() {
			this.show = false;
		},
		submit() {
			this.validateForm('AddUserForm').then(async res => {
				let params = FormUtil.filterHasValue(this.Form);
				params['roleIds'] = params['roleIds'].join(',');
				let { code, data, msg } = await ApiUser.addUser(params);
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				this.emptyForm('AddUserForm');
				this.close();
				this.$emit('success');
			} else {
				this.$message.warning(`warning:${ErrorMsg}`);
			}
		},
		emitRoleId(val) {
			console.log(val);
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
.el-form {
	padding-right: 2rem;
}
</style>
