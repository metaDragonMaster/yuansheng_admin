<template>
	<el-row :gutter="16">
		<el-col :xs="l_col.xs" :sm="l_col.sm" :md="l_col.md" :lg="l_col.lg" :xl="l_col.xl">
			<el-card class="tableDom">
				<div class="treeOperation">
					<el-button :disabled="!haveCurrentRow" type="warning" @click="removeCurrentRow()">取消选择行</el-button>
				</div>
				<el-table :data="tableData" border  v-loading="isLoading" ref="TableDom" @row-click="handleCurrentChange" highlight-current-row >
					<el-table-column label="序号" type="index" width="50" align="center">
						<template slot-scope="scope">
							{{ scope.$index + 1 + ((tableQueryOption.current - 1) * tableQueryOption.size )}}
							<i :class="{ 'el-icon-thumb': haveCurrentRow ? currentRow.id == scope.row.id : false }"></i>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							
						</template>
					</el-table-column>
				</el-table>
				<TablePagination
					:total="tableQueryOption.total"
					:current="tableQueryOption.current"
					@currentChange="
						val => {
							tableQueryOption.current = val;
							getTableData();
						}
					"
					@sizeChange="
						val => {
							tableQueryOption.size = val;
							getTableData();
						}
					"
				/>
			</el-card>
		</el-col>
		<el-col  class="sticky-col" :xs="r_col.xs" :sm="r_col.sm" :md="r_col.md" :lg="r_col.lg" :xl="r_col.xl">
			<el-card class="operation">
				<div slot="header" class="operation-header">
					<span>{{ operationTypeTitle }}</span>
				</div>
				<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
					<el-form-item prop="name" label="类型名称">
						<el-input v-model="Form.name" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submit">提交表单</el-button>
						<el-button type="warning" @click="emptyForm">重置表单</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-col>
	</el-row>
</template>
<script>
// import Api from '@/api/.js';
import TablePagination from '@/components/TablePagination/index.vue';
export default {
	data(){return{
		l_col: {
			xs: 24,
			sm: 24,
			md: 14,
			lg: 14,
			xl: 14
		},
		r_col: {
			xs: 24,
			sm: 24,
			md: 10,
			lg: 10,
			xl: 10
		},
		isLoading:false,
		currentRow:null,// 被选择的行
		tableData:[],
		tableQueryOption:{
			current:1,
			size:10,
			total:0
		},
		Form:{
			name:'',
		},
		Rules:{
			name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
		}
	}},
	components: {
		TablePagination
	},
	computed: {
		operationTypeTitle() {
			return '新增';
		},
		haveCurrentRow() {
			return !!this.currentRow;
		},
	},
	mounted() {
		
	},
	methods:{
		emptyForm() {
			//重置表单
			this.$nextTick(() => {
				this.clearValidate('Form');
				this.resetForm('Form');
			});
		},
		resetForm(formName) {
			//清空表单的验证结果
			this.$refs[formName].resetFields();
		},
		clearValidate(formName) {
			//移除该表单项的校验结果
			this.$refs[formName].clearValidate();
		},
		handleCurrentChange(val) {
			//选择行
			this.currentRow = val;
			console.log(this.currentRow);
			// this.Form
		},
		removeCurrentRow() {
			//取消选择行
			this.currentRow = null;
			this.emptyForm()
			this.$refs["TableDom"].setCurrentRow(-1);
		},
		submit() {
			this.$refs['Form'].validate(async valid => {
				if (valid) {
					console.log('submit!!');
					// !this.haveCurrentRow ? this.add() : this.update();
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		init() {
			console.log("init view")
			this.getTableData();
		},
		async getTableData() {
			
		}
	}
}
</script>