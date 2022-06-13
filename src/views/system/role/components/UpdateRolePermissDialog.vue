<template>
	<FormDialog ref="FormDialog" title="修改菜单权限" width="500px" top="10vh" v-model="show" :drag="true" @close="close">
		<!-- {{row}} -->
		<el-tree 
			:data="menuTree" 
			accordion 
			check-strictly
			node-key="mid" 
			ref="tree" 
			show-checkbox 
			:props="menuTreeProps" 
			@check-change="handleCheckChange"
			:default-checked-keys="defaultKeys"
		>
			<div class="custom-tree-node" slot-scope="{ node, data }">
				<p>{{ node.label }}</p>
			</div>
		</el-tree>
		<template slot="footer">
			<el-button @click="show = false">取消</el-button>
			<el-button type="warning" @click="emptyForm(formName)">重置表单</el-button>
			<el-button type="primary" @click="submit()">提交</el-button>
		</template>
	</FormDialog>
</template>
<script>
import ApiRole from '@/api/system/role.js';
import FormUtil from '@/utils/formUtil.js';
import FormDialog from '@/components/FormDialog/index.vue';
export default {
	props: {
		menuTree: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			formName: 'UpdateRolePermissForm',
			show: false,
			// row: {},
			id:'',
			menuTreeProps: {
				//路由树配置
				children: 'children',
				label: 'menuName'
			},
			defaultKeys:[],
		};
	},
	components: {
		FormDialog
	},
	computed: {},
	mounted() {},
	methods: {
		handleCheckChange(data, checked, indeterminate) {
			console.log(data, checked, indeterminate);
		},
		open(row) {
			// this.row = row;
			this.id = row.id;
			this.show = true;
			let menuIds = row.menuIds;
			if(menuIds&&menuIds.length>0) {
				this.$nextTick(()=>{
					let ids = FormUtil.stringToNumberArray(menuIds);
					this.$refs['tree'].setCheckedKeys(ids);
					// this.$refs['tree'].setCheckedKeys(ids);
					// this.defaultKeys
				})
			} else {
				this.close();
			}
			
		},
		close() {
			this.$refs['tree'].setCheckedKeys([]);
		},
		async submit() {
			let menuIds = this.$refs['tree'].getCheckedKeys().join(',');
			console.log(menuIds)
			let params = {
				menuIds:menuIds
			};
			let { code, data, msg } = await ApiRole.updatePermissById(this.id, params);
			this.success(code, msg);
		},
		success(Code, ErrorMsg) {
			console.log(Code, ErrorMsg);
			if (Code == 10200) {
				// this.emptyForm(this.formName);
				// this.close();
				this.show = false;
				this.$emit('success');
			} else {
				this.$message.warning(`warning:${ErrorMsg}`);
			}
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
