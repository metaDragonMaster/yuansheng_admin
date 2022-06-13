<template>
	<FormDialog ref="FormDialog" title="合作社审核表单" width="500px" top="12vh" v-model="show" :drag="false" >
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" label-width="7rem">
			<el-form-item prop="pass" label="是否通过审核">
				<el-radio-group v-model="Form.pass">
					<el-radio-button :label="true">通过</el-radio-button>
					<el-radio-button :label="false">未通过</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="msg" label="未通过原因" v-show="Form.pass == false">
				<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="Form.msg"></el-input>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<el-button @click="close">取消</el-button>
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import ApiCooperative from '@/api/nzjc/cooperativeManage.js';
import FormUtil from '@/utils/formUtil.js';

// import mixin from "./mixin.js"
// import SelectAddress from '@/components/SelectAddress/cascader.vue';
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	data() {
		return {
			cooperativeId: '',
			formName: 'UpdateCheckUserForm',
			show: false,
			Form: {
				pass: false, //	是否通过审核	query	true	boolean
				msg: '' //	未通过原因	query	false	string
			},
			Rules: {}
		};
	},
	// mixins:[
	// 	mixin
	// ],
	props: {},
	components: {
		FormDialog
	},
	methods: {
		open(row) {
			if (row) {
				this.$nextTick(async () => {
					this.cooperativeId = row.id;
					// console.log()
				});
				this.show = true;
			}
		},
		close() {
			console.log('close');
			this.show = false; 
			this.cooperativeId = '';
			this.Form.pass = false;
			this.Form.msg = '';
		},
		submit() {
			this.validateForm(this.formName).then(async res => {
				let params = {
					pass: this.Form.pass,
				};
				if(this.Form.pass == false) {
					params.msg = this.Form.msg
				}
				let { code, data, msg } = await ApiCooperative.setCheckUserById(this.cooperativeId, params);
				this.success(code, msg);
			});
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				this.close()
				this.$emit('success');
			} else {
				this.$message.warning(`warning:${ErrorMsg}`);
			}
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
