<template>
	<FormDialog ref="FormDialog" title="审核店铺" width="1000px" top="12vh" v-model="show" :drag="false" append-to-body>
		{{ Form }}
		<el-form :ref="formName" :model="Form" :rules="Rules" label-position="right" inline label-width="7rem">
			<el-form-item prop="mobile" label="联系电话"><el-input v-model="Form.mobile"></el-input></el-form-item>
			<el-form-item prop="realName" label="真实姓名"><el-input v-model="Form.realName"></el-input></el-form-item>
			<el-form-item prop="idNumber" label="身份证号"><el-input v-model="Form.idNumber"></el-input></el-form-item>
			<el-form-item class="submit-form-item">
				<el-button class="drift-right" type="primary" @click="submit()">提交</el-button>
			</el-form-item>
		</el-form>
		<el-table
			ref="TableDom"
			:data="tableData"
			show-overflow-tooltip
			tooltip-effect="dark"
			:header-cell-style="{ textAlign: 'center', 'background-color': '#f9f9f9', color: '#333333' }"
			:cell-style="{ textAlign: 'center' }"
		>
			<el-table-column label="真实姓名" prop="realName" min-width="200"></el-table-column>
			<el-table-column label="联系电话" prop="mobile" min-width="200"></el-table-column>
			<el-table-column label="身份证号" prop="idNumber" min-width="200"></el-table-column>
			<el-table-column label="操作" :fixed="tableData.length > 0 ? 'right' : false" width="160">
				<template v-slot="{ row }">
					<el-button type="success" @click="success(row)">选择该用户</el-button>
				</template>
			</el-table-column>
		</el-table>
		<template slot="footer">
			<el-button @click="close()">关闭</el-button>
			<!-- <el-button type="primary" @click="submit()">提交</el-button> -->
		</template>
	</FormDialog>
</template>
<script>
import Api from '@/api/system/user.js';
import FormUtil from '@/utils/formUtil.js';

import FormDialog from '@/components/FormDialog/index.vue';
export default {
	data() {
		return {
			formName: 'SelectUserForm',
			show: false,
			Form: {
				mobile: '17788888888', //	联系电话	query	true	string
				realName: '何赛花', //	真实姓名	query	true	string
				idNumber: '' //	身份证号	query	false	string
			},
			Rules: {
				mobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
				realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
			},
			tableData:[]
		};
	},
	components: {
		FormDialog
	},
	methods: {
		open() {
			this.show = true;
		},
		close() {
			this.emptyForm(this.formName);
			this.show = false;
		},
		async submit() {
			this.validateForm(this.formName).then(async () => {
				let params = {
					...FormUtil.filterHasValue(this.Form),
				};
				let { code, data, msg } = await Api.selectUserListToAddShop(params);
				if (code == 10200) {
					this.tableData = data;
					if(data.length<=0) {
						this.$message.warning(`warning:没有搜索到该成员`);
					}
				} else {
					this.$message.warning(`warning:${msg}`);
				}
			});
		},
		success(row) {
			this.$emit('success', row);
			this.close();
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
.submit-form-item {
	width: 100%;
	::v-deep.el-form-item__content {
		width: 100%;
		display: flex;
		.drift-right {
			margin-right: 2.5rem;
		}
	}
}
</style>