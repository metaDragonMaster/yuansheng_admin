<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>合作社管理</span>
				<!-- <el-button @click="emptyQuery" type="primary" class="drift-right">清空条件</el-button> -->
				<el-button @click="$refs['AddCooperativeDialog'].open()" type="success" class="drift-right">添加合作社</el-button>
				<el-button @click="$refs['FormDrawer'].open()" type="primary" class="drift-right">打开查询表单</el-button>
			</div>
			<el-table
				ref="TableDom"
				v-loading="tableLoading"
				:data="tableData"
				show-overflow-tooltip
				tooltip-effect="dark"
				:header-cell-style="{ textAlign: 'center', 'background-color': '#f9f9f9', color: '#333333' }"
				:cell-style="{ textAlign: 'center' }"
			>
				<el-table-column prop="pid" label="父级合作社id" min-width="120"></el-table-column>
				<el-table-column prop="name" label="合作社名字" min-width="200"></el-table-column>
				<el-table-column prop="status" label="合作社状态" min-width="160" 
				:formatter="row => getItemLabel(this.selectStatus, row.status)" 
				class-name="span-blue"></el-table-column>
				<el-table-column label="合作社信息">
					<el-table-column prop="address" label="通讯地址" min-width="120"></el-table-column>
					<el-table-column prop="cityNo" label="所在地编号" min-width="180"></el-table-column>
					<el-table-column
						prop="cooperativeLv"
						label="合作社等级"
						min-width="120"
						:formatter="row => getItemLabel(this.selectCooperativeLv, row.cooperativeLv)"
					></el-table-column>
					<el-table-column prop="licenseCode" label="营业执照编号" min-width="120"></el-table-column>
					<el-table-column prop="mcc" label="经营类目" min-width="120"></el-table-column>
				</el-table-column>
				<el-table-column label="银行信息">
					<el-table-column prop="bankName" label="银行名称" min-width="120"></el-table-column>
					<el-table-column prop="bankNo" label="银行账号" min-width="120"></el-table-column>
					<el-table-column prop="bankPhoneNo" label="银行预留手机号" min-width="120"></el-table-column>
					<el-table-column prop="bankUserName" label="银行开户人姓名" min-width="120"></el-table-column>
				</el-table-column>
				<el-table-column label="联系人信息">
					<el-table-column prop="contactName" label="姓名" min-width="120"></el-table-column>
					<el-table-column prop="contactPhoneNo" label="电话号码" min-width="120"></el-table-column>
					<el-table-column prop="contactCertificationNo" label="身份证号" min-width="200"></el-table-column>
				</el-table-column>
				<el-table-column label="法人信息">
					<el-table-column prop="realName" label="真实姓名" min-width="120"></el-table-column>
					<el-table-column prop="phoneNo" label="联系电话" min-width="120"></el-table-column>
					<el-table-column prop="certificationNo" label="身份证号" min-width="200"></el-table-column>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="200"></el-table-column>
				<el-table-column label="操作" :fixed="tableData.length > 0 ? 'right' : false" min-width="160">
					<template v-slot="{ row }">
						<el-link type="warning" @click="$refs['SubRouterDialog'].open(row)">成员信息</el-link>
						<el-link type="warning" @click="$refs['UpdateCooperativeDialog'].open(row)">基本信息</el-link>
						<el-link type="warning" @click="$refs['UpdateBankInfo'].open(row)">银行账户</el-link>
						<el-link type="warning" @click="$refs['UpdatePhotoInfo'].open(row)">证件照</el-link>
						<el-link type="warning" @click="$refs['UpdateCheckUser'].open(row)">审核</el-link>
						<!-- setCheckUserById -->
						<el-link type="success" @click="setActiveById(row.id)" v-show="row.status == -3">激活</el-link>
						<el-link type="danger" @click="deleteRow(row.id)" v-show="row.status != -3">冻结</el-link>
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
		<SubRouterDialog ref="SubRouterDialog"></SubRouterDialog>
		<AddCooperativeDialog ref="AddCooperativeDialog" @success="startGetTableData"></AddCooperativeDialog>
		<UpdateCooperativeDialog ref="UpdateCooperativeDialog" @success="startGetTableData"></UpdateCooperativeDialog>
		<UpdateBankInfo ref="UpdateBankInfo" @success="startGetTableData"></UpdateBankInfo>
		<UpdatePhotoInfo ref="UpdatePhotoInfo" @success="startGetTableData"></UpdatePhotoInfo>
		<UpdateCheckUser ref="UpdateCheckUser" @success="startGetTableData"></UpdateCheckUser>
		<FormDrawer ref="FormDrawer" size="600px" title="查询表单" @submit="submit" @success="startGetTableData">
			<!--  @closed="emptyForm" -->
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="160px">
				<el-form-item prop="createTimeFrom" label="起始时间"><el-input v-model="Form.createTimeFrom"></el-input></el-form-item>
				<el-form-item prop="createTimeTo" label="截止时间"><el-input v-model="Form.createTimeTo"></el-input></el-form-item>
				<el-divider content-position="center">合作社</el-divider>
				<el-form-item prop="status" label="状态"><el-input v-model="Form.status"></el-input></el-form-item>
				<el-form-item prop="cityNo" label="所在城市"><SelectAddress v-model="Form.cityNo"></SelectAddress></el-form-item>
				<el-form-item prop="address" label="详细地址"><el-input v-model="Form.address"></el-input></el-form-item>
				<el-form-item prop="cooperativeLv" label="合作社等级"><el-input v-model="Form.cooperativeLv"></el-input></el-form-item>
				<el-form-item prop="licenseCode" label="营业执照编号"><el-input v-model="Form.licenseCode"></el-input></el-form-item>
				<el-form-item prop="mcc" label="经营类目"><el-input v-model="Form.mcc"></el-input></el-form-item>
				<el-divider content-position="center">银行信息</el-divider>
				<el-form-item prop="bankName" label="开户行"><el-input v-model="Form.bankName"></el-input></el-form-item>
				<el-form-item prop="bankNo" label="银行卡号码"><el-input v-model="Form.bankNo"></el-input></el-form-item>
				<el-form-item prop="bankPhoneNo" label="开户预留手机号"><el-input v-model="Form.bankPhoneNo"></el-input></el-form-item>
				<el-form-item prop="bankUserName" label="银行卡开户人名字"><el-input v-model="Form.bankUserName"></el-input></el-form-item>
				<el-divider content-position="center">联系人</el-divider>
				<el-form-item prop="contactCertificationNo" label="联系人身份证号码"><el-input v-model="Form.contactCertificationNo"></el-input></el-form-item>
				<el-form-item prop="contactName" label="联系人姓名"><el-input v-model="Form.contactName"></el-input></el-form-item>
				<el-form-item prop="contactPhoneNo" label="联系人电话号码"><el-input v-model="Form.contactPhoneNo"></el-input></el-form-item>
				<el-divider content-position="center">法人</el-divider>
				<el-form-item prop="certificationNo" label="身份证号码"><el-input v-model="Form.certificationNo"></el-input></el-form-item>
				<el-form-item prop="phoneNo" label="联系电话"><el-input v-model="Form.phoneNo"></el-input></el-form-item>
				<el-form-item prop="realName" label="法人真实姓名"><el-input v-model="Form.realName"></el-input></el-form-item>
			</el-form>
			<el-button type="warning" slot="footer" @click="emptyForm('Form')">重置</el-button>
		</FormDrawer>
	</el-row>
</template>
<script>
import Api from '@/api/nzjc/cooperativeManage.js';
import $_Confirm from '@/utils/confirm.js';
import FormUtil from '@/utils/formUtil.js';
import selectMixin from './selectMixin.js';

import AddCooperativeDialog from './components/AddCooperativeDialog.vue';
import UpdateCooperativeDialog from './components/UpdateCooperativeDialog.vue';
import UpdateBankInfo from './components/UpdateBankInfo.vue';
import UpdatePhotoInfo from './components/UpdatePhotoInfo.vue';
import UpdateCheckUser from './components/UpdateCheckUser.vue';

import SubRouterDialog from './views/routerView.vue';


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
				cooperativeId: '', //	合作社id	query	false	integer(int32)
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
		AddCooperativeDialog,
		UpdateCooperativeDialog,
		UpdateBankInfo,
		UpdatePhotoInfo,
		UpdateCheckUser,

		SubRouterDialog,
	},
	mounted() {
		this.init();
	},
	methods: {
		getItemLabel: FormUtil.getItemLabel,
		filterRowImagesToList(row) {
			let list = [];
			let imagesKey = [
				'bankCardFrontPhoto', //			银行卡正面	false	string
				'licenseCodePhoto', //			营业执照		false	string
				'legalCertificationBackPhoto', //	法人身份证反面		false	string
				'legalCertificationFrontPhoto' //	法人身份证正面		false	string
			];
			let images = row.filter(item=>{
				conosle.log(item);
				return item;
			});
			console.log(images);
		},
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
			return params;
		},
		async getTableData() {
			this.tableLoading = true;
			let params = await this.fliterFrom();
			let { code, data, msg } = await Api.selectCooperativeManageList(params).finally(() => {
				setTimeout(() => {
					this.tableLoading = false;
				}, 1000);
			});
			if (code == 10200) {
				this.tableData = data.records;
				this.tableQueryOption.total = data.total;
			}
			// this.tableLoading = false;
		},
		async setActiveById(ids) {
			$_Confirm({
				title: '激活操作',
				content: '是否确认激活该合作社',
				thenFunc: async () => {
					let { code, data, msg } = await Api.setActiveById(ids);
					if (code == 10200) {
						this.tableQueryOption.current = 1;
						this.getTableData();
					}
				}
			});
		},
		async deleteRow(ids) {
			$_Confirm({
				title: '冻结操作',
				content: '是否确认冻结该合作社',
				thenFunc: async () => {
					let { code, data, msg } = await Api.setFrostUserById(ids);
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

<style lang="scss" scoped>
.span-blue {
	color: #000FFF;
}
</style>