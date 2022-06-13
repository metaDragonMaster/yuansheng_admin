<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>合作社用户管理</span>
				<!-- <el-button @click="emptyQuery" type="primary" class="drift-right">清空条件</el-button> -->
				<el-button @click="$refs['AddUserDialog'].open()" type="success" class="drift-right">添加用户</el-button>
				<el-button @click="$refs['FormDrawer'].open()" type="primary" class="drift-right">打开查询表单</el-button>
			</div>
			{{Form}}
			<el-table
				ref="TableDom"
				v-loading="tableLoading"
				:data="tableData"
				show-overflow-tooltip
				tooltip-effect="dark"
				:header-cell-style="{ textAlign: 'center', 'background-color': '#f9f9f9', color: '#333333' }"
				:cell-style="{ textAlign: 'center' }"
			>
				<el-table-column prop="address" label="地址" min-width="120"></el-table-column>
				<el-table-column prop="adminLv" label="管理员等级" min-width="120" :formatter="row => getItemLabel(this.selectAdminLv, row.adminLv)"></el-table-column>
				<el-table-column prop="age" label="年龄" min-width="120"></el-table-column>
				<el-table-column prop="certificationNo" label="身份证号码" min-width="180"></el-table-column>
				<el-table-column prop="cityNo" label="所在城市" min-width="120"></el-table-column>
				<!-- <el-table-column prop="cooperativeId" label="合作社ID" min-width="120"></el-table-column> -->
				<el-table-column prop="farmerId" label="农户id" min-width="120"></el-table-column>
				<el-table-column prop="health" label="健康状况" min-width="120" :formatter="row => getItemLabel(this.selectHealth, row.health)"></el-table-column>
				<el-table-column prop="isHost" label="是否是户主" min-width="120" :formatter="row => (row.isHost ? '是' : '否')"></el-table-column>
				<el-table-column prop="job" label="工作" min-width="120"></el-table-column>
				<el-table-column prop="phoneNo" label="联系电话" min-width="120"></el-table-column>
				<el-table-column prop="mcc" label="经营类目" min-width="120"></el-table-column>
				<el-table-column prop="name" label="合作社名称" min-width="120"></el-table-column>
				<el-table-column
					prop="politicalStatus"
					label="政治面貌"
					min-width="120"
					:formatter="row => getItemLabel(this.selectPoliticalStatus, row.politicalStatus)"
				></el-table-column>
				<el-table-column prop="realName" label="真实姓名" min-width="120"></el-table-column>
				<el-table-column prop="sex" label="性别" min-width="120" :formatter="row => getItemLabel(this.selectSex, row.sex)"></el-table-column>
				<el-table-column prop="status" label="状态" min-width="120" :formatter="row => getItemLabel(this.selectStatus, row.status)"></el-table-column>
				<el-table-column prop="userId" label="用户ID" min-width="120"></el-table-column>
				<el-table-column label="操作" :fixed="tableData.length > 0 ? 'right' : false" min-width="240">
					<template v-slot="{ row }">
						<el-link type="warning" @click="$refs['UpdateUserDialog'].open(row)">修改用户</el-link>
						<el-link type="warning" @click="$refs['SetAdminLv'].open(row.id, row.adminLv)">设置管理员</el-link>
						<el-link type="danger" @click="deleteRow(row.id)">删除</el-link>
					</template>
				</el-table-column>
				<el-empty description="暂无数据" slot="empty"><el-button type="primary" @click="startGetTableData">尝试获取</el-button></el-empty>
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
		<AddUserDialog ref="AddUserDialog" @success="startGetTableData"></AddUserDialog>
		<UpdateUserDialog ref="UpdateUserDialog" @success="startGetTableData"></UpdateUserDialog>
		<SetAdminLv ref="SetAdminLv" @success="startGetTableData"></SetAdminLv>
		<FormDrawer ref="FormDrawer" size="800px" title="查询表单" @submit="submit" @success="startGetTableData">
			<!--  @closed="emptyForm" -->
			<el-form ref="Form" :model="Form" :rules="Rules" inline label-position="right" label-width="120px">
				<el-form-item prop="adminLv" label="管理员等级">
					<el-select v-model="Form.adminLv"><el-option v-for="item in selectAdminLv" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
				</el-form-item>
				<el-form-item prop="health" label="健康状况">
					<el-select v-model="Form.health"><el-option v-for="item in selectHealth" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
				</el-form-item>
				<el-form-item prop="sex" label="性别">
					<el-select v-model="Form.sex"><el-option v-for="item in selectSex" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
				</el-form-item>
				<el-form-item prop="politicalStatus" label="政治面貌">
					<el-select v-model="Form.politicalStatus">
						<el-option v-for="item in selectPoliticalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="cityNo" label="所在城市"><SelectAddress v-model="Form.cityNo"></SelectAddress></el-form-item>
				<el-form-item prop="address" label="通讯地址"><el-input v-model="Form.address"></el-input></el-form-item>
				<el-form-item prop="age" label="年龄"><el-input v-model="Form.age"></el-input></el-form-item>
				<el-form-item prop="certificationNo" label="身份证号码"><el-input v-model="Form.certificationNo"></el-input></el-form-item>
				<!-- <el-form-item prop="cooperativeId" label="合作社id"><el-input v-model="Form.cooperativeId"></el-input></el-form-item> -->
				<el-form-item prop="createTimeFrom" label="开始时间">
					<el-date-picker v-model="Form.createTimeFrom" type="datetime" placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<el-form-item prop="createTimeTo" label="结束时间">
					<el-date-picker v-model="Form.createTimeTo" type="datetime" placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<el-form-item prop="farmerId" label="农户id"><el-input v-model="Form.farmerId"></el-input></el-form-item>

				<el-form-item prop="isHost" label="是否是户主">
					<el-radio-group v-model="Form.isHost">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="job" label="工作"><el-input v-model="Form.job"></el-input></el-form-item>
				<el-form-item prop="phoneNo" label="联系电话"><el-input v-model="Form.phoneNo"></el-input></el-form-item>
				<el-form-item prop="realName" label="真实姓名"><el-input v-model="Form.realName"></el-input></el-form-item>
				<el-form-item prop="userId" label="用户id"><el-input v-model="Form.userId"></el-input></el-form-item>
			</el-form>
			<el-button type="warning" slot="footer" @click="emptyForm('Form')">重置</el-button>
		</FormDrawer>
	</el-row>
</template>
<script>
import Api from '@/api/nzjc/cooperativeUserManage.js';
import $_Confirm from '@/utils/confirm.js';
import FormUtil from '@/utils/formUtil.js';
import selectMixin from './selectMixin.js';
import { mapActions, mapGetters } from 'vuex';

import AddUserDialog from './components/AddUserDialog.vue';
import UpdateUserDialog from './components/UpdateUserDialog.vue';
import SetAdminLv from './components/SetAdminLv.vue';

import SelectAddress from '@/components/SelectAddress/cascader.vue';
import FormDrawer from '@/components/FormDrawer/index.vue';
import TablePagination from '@/components/TablePagination/index.vue';
export default {
	mixins: [selectMixin],
	data() {
		return {
			tableLoading: false,
			tableData: [],
			tableQueryOption: {
				size: 10,
				current: 1,
				total: 0
			},
			Form: {
				address: '', //通讯地址	query	false	string
				adminLv: '', //管理员等级（0 普通成员，1一级管理员， 2二级管理员）	query	false	integer(int32)
				age: '', //年龄	query	false	integer(int32)
				certificationNo: '', //	身份证号码	query	false	string
				cityNo: '', //	所在城市	query	false	string
				// cooperativeId: '', //	合作社id	query	false	integer(int32)
				createTimeFrom: '', //	起始时间	query	false	string
				createTimeTo: '', //	截止时间	query	false	string
				farmerId: '', //	农户id	query	false	integer(int32)
				health: '', //	健康状况（0 健康 1一般 2 欠佳）	query	false	integer(int32)
				isHost: '', //是否是户主	query	false	boolean
				job: '', //	工作	query	false	string
				phoneNo: '', //	联系电话	query	false	string
				politicalStatus: '', //	政治面貌（0群众 1党员）	query	false	integer(int32)
				realName: '', //真实姓名	query	false string
				sex: '', //性别 0男 1女 2保密	query	false string
				userId: '' //	用户id（整个用户系统的userId）	query	false	integer(int32)
				// field: '', //	排序字段	query	false	string
				// order: '', //	排序规则，asc升序，desc降序	query	false	string
			},
			Rules: {}
		};
	},
	components: {
		FormDrawer,
		TablePagination,
		SelectAddress,
		AddUserDialog,
		UpdateUserDialog,
		SetAdminLv
	},
	computed: {
		// ...mapGetters({cooperativeInfo:"cooperative/cooperativeInfo"}),
		...mapGetters(['cooperativeInfo'])
	},
	// mounted() {
	// this.init();
	// },
	methods: {
		getItemLabel: FormUtil.getItemLabel,
		async emptyQuery() {
			await this.emptyForm('Form');
			this.startGetTableData();
		},
		startGetTableData() {
			this.tableQueryOption.current = 1;
			this.getTableData();
		},
		init() {
			this.getTableData();
		},
		submit() {
			this.validateForm('Form').then(res => {
				this.$refs['FormDrawer'].closeDrawer();
			});
		},
		async fliterFrom() {
			let form = await FormUtil.filterHasValue(this.Form);
			let options = await FormUtil.excludeAttr(this.tableQueryOption, 'total');
			let params = {
				...form,
				...options
			};
			params.cooperativeId = this.cooperativeInfo.id;
			console.log(form)
			return params;
		},
		async getTableData() {
			this.tableLoading = true;
			let params = await this.fliterFrom();
			let { code, data, msg } = await Api.selectCooperativeUserList(params).finally(() => {
				this.tableLoading = false;
			});
			if (code == 10200) {
				this.tableData = data.records;
				this.tableQueryOption.total = data.total;
			}
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await Api.deleteCooperativeUserByIds(ids);
					if (code == 10200) {
						this.tableQueryOption.current = 1;
						this.getTableData();
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
