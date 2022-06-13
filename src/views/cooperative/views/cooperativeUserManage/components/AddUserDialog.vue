<template>
	<FormDialog ref="FormDialog" title="添加用户" width="1040px" top="12vh" v-model="show" append-to-body>
		<!-- :drag="false" -->
		{{Form}}
		<el-form :ref="formName" :model="Form" :rules="Rules" inline label-position="right" label-width="100px">
			<el-form-item prop="address" label="通讯地址"><el-input v-model="Form.address"></el-input></el-form-item>
			<el-form-item prop="adminLv" label="管理员等级">
				<el-select v-model="Form.adminLv"><el-option v-for="item in selectAdminLv" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
			</el-form-item>
			<el-form-item prop="age" label="年龄"><el-input v-model="Form.age"></el-input></el-form-item>
			<el-form-item prop="certificationNo" label="身份证号码"><el-input v-model="Form.certificationNo"></el-input></el-form-item>
			<el-form-item prop="cityNo" label="所在城市"><SelectAddress v-model="Form.cityNo"></SelectAddress></el-form-item>
			<!-- <el-form-item prop="cooperativeId" label="合作社id"><el-input v-model="Form.cooperativeId"></el-input></el-form-item> -->
			<el-form-item prop="health" label="健康状况">
				<el-select v-model="Form.health"><el-option v-for="item in selectHealth" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
			</el-form-item>
			<el-form-item prop="job" label="工作"><el-input v-model="Form.job"></el-input></el-form-item>

			<el-form-item prop="politicalStatus" label="政治面貌">
				<el-select v-model="Form.politicalStatus">
					<el-option v-for="item in selectPoliticalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="realName" label="真实姓名"><el-input v-model="Form.realName"></el-input></el-form-item>
			<el-form-item prop="phoneNo" label="联系电话"><el-input v-model="Form.phoneNo"></el-input></el-form-item>
			<el-form-item prop="sex" label="性别">
				<el-select v-model="Form.sex"><el-option v-for="item in selectSex" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
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
import SelectAddress from '@/components/SelectAddress/cascader.vue';
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	mixins:[selectMixin],
	data() {
		return {
			formName:"AddRoleForm",
			show:false,
			// Form: {
			// 	address: '', //通讯地址	query	false	string
			// 	adminLv: '', //管理员等级（0 普通成员，1一级管理员， 2二级管理员）	query	false	integer(int32)
			// 	age: '', //年龄	query	false	integer(int32)
			// 	certificationNo: '', //	身份证号码	query	false	string
			// 	cityNo: '', //	所在城市	query	false	string
			// 	cooperativeId: '', //	合作社id	query	false	integer(int32)
			// 	health: '', //	健康状况（0 健康 1一般 2 欠佳）	query	false	integer(int32)
			// 	job: '', //	工作	query	false	string
			// 	phoneNo: '', //	联系电话	query	false	string
			// 	politicalStatus: '', //	政治面貌（0群众 1党员）	query	false	integer(int32)
			// 	realName: '', //真实姓名	query	false string
			// 	sex: '', //性别 0男 1女 2保密	query	false string
			// },
			Form: {
				address: '北京市', //通讯地址	query	false	string
				adminLv: 0, //管理员等级（0 普通成员，1一级管理员， 2二级管理员）	query	false	integer(int32)
				age: '20', //年龄	query	false	integer(int32)
				certificationNo: '431515200106051102', //	身份证号码	query	false	string
				cityNo: [ "140000", "140300", "140303" ], //	所在城市	query	false	string
				cooperativeId: '', //	合作社id	query	false	integer(int32)
				health: 0, //	健康状况（0 健康 1一般 2 欠佳）	query	false	integer(int32)
				job: '农民', //	工作	query	false	string
				phoneNo: '15156684484', //	联系电话	query	false	string
				politicalStatus: 0, //	政治面貌（0群众 1党员）	query	false	integer(int32)
				realName: '何赛花', //真实姓名	query	false string
				sex: 1, //性别 0男 1女 2保密	query	false string
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
		}
	},
	components: {
		FormDialog,
		SelectAddress,
	},
	methods: {
		open() {
			this.show = true;
		},
		close() {
			this.show = false;
			this.emptyForm(this.formName);
		},
		submit() {
			this.validateForm(this.formName).then(async res => {
				let params = {
					...this.Form,
				};
				params['cityNo'] = params['cityNo'].join(',');
				params.cooperativeId = this.cooperativeInfo.id;
				console.log(params)
				let { code, data, msg } = await ApiCooperativeUser.addCooperativeUser(params);
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				// this.emptyForm(this.formName);
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
.el-form {
	padding-right: 2rem;
}
</style>
