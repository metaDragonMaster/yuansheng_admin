<template>
	<div class="add-member">
		<el-dialog :title="dialogTitle" :visible.sync="show" top="6vh" width="980px" :close-on-click-modal="false" append-to-body @closed="close">
			<!-- {{ farmerId }} {{ isChange }} -->
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
				<!-- {{ users }} -->
				<el-form-item prop="hostId" label="户主">
					<div class="people">
						<p v-for="(item, index) in users" :key="index">
							<span>{{ item.realName }}</span>
							<span>{{ item.certificationNo }}</span>
							<i class="el-icon-close" @click="users.splice(index, 1)"></i>
						</p>
						<el-button @click="addCensus('SelectAndAddCensus')">{{ users.length > 0 ? '更改' : '添加' }}</el-button>
					</div>
				</el-form-item>
				<!-- {{ familys }} -->
				<el-form-item prop="family" label="家庭成员">
					<div class="people">
						<p v-for="(item, index) in familys" :key="index">
							<span>{{ item.realName }}</span>
							<span>{{ item.certificationNo }}</span>
							<i class="el-icon-close" @click="familys.splice(index, 1)"></i>
						</p>
						<el-button @click="addCensus('SelectAndAddCensusSelection')">添加</el-button>
					</div>
				</el-form-item>
				<el-form-item prop="annualIncome" label="家庭年收入">
					<el-input-number :controls="false" :min="0" v-model="Form.annualIncome" clearable></el-input-number>
					元
				</el-form-item>
				<el-form-item prop="agriculturalIncome" label="农业收入">
					<el-input-number :controls="false" :min="0" v-model="Form.agriculturalIncome" clearable></el-input-number>
					元
				</el-form-item>
				<el-form-item prop="house" label="住房情况">
					<el-select v-model="Form.house" placeholder="请选择">
						<el-option v-for="item in selectHouse" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<div class="grid-form-items">
					<el-form-item prop="houseArea" label="住房面积" class="mini-form-item">
						<el-input-number :controls="false" :min="0" v-model="Form.houseArea"></el-input-number>
						平方米
					</el-form-item>
					<el-form-item prop="houseBaseArea" label="宅基地面积">
						<el-input-number :controls="false" :min="0" v-model="Form.houseBaseArea"></el-input-number>
						平方米
					</el-form-item>
					<el-form-item prop="paddyFieldArea" label="水田面积">
						<el-input-number :controls="false" :min="0" v-model="Form.paddyFieldArea"></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="irrigatedLandArea" label="灌溉地面积">
						<el-input-number :controls="false" :min="0" v-model="Form.irrigatedLandArea"></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="grassLandArea" label="牧草地面积">
						<el-input-number :controls="false" :min="0" v-model="Form.grassLandArea" ></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="dryLandArea" label="旱田面积">
						<el-input-number :controls="false" :min="0" v-model="Form.dryLandArea" ></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="shrubberyArea" label="灌木林面积">
						<el-input-number :controls="false" :min="0" v-model="Form.shrubberyArea" ></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="sparseWoodlandArea" label="疏林地面积">
						<el-input-number :controls="false" :min="0" v-model="Form.sparseWoodlandArea" ></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="traceWoodlandArea" label="迹地面积">
						<el-input-number :controls="false" :min="0" v-model="Form.traceWoodlandArea" ></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="nurseryArea" label="苗圃面积">
						<el-input-number :controls="false" :min="0" v-model="Form.nurseryArea" ></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="lakeArea" label="湖面面积">
						<el-input-number :controls="false" :min="0" v-model="Form.lakeArea" ></el-input-number>
						亩
					</el-form-item>
					<el-form-item prop="poolArea" label="池塘面积">
						<el-input-number :controls="false" :min="0" v-model="Form.poolArea" ></el-input-number>
						亩
					</el-form-item>
				</div>
				<el-form-item>
					<el-button class="submit-button" type="success" @click="submit">提交</el-button>
					<el-button @click="show = false">返回</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<SelectAndAddCensus ref="SelectAndAddCensus" @emitAll="setHostUser" append-to-body></SelectAndAddCensus>
		<SelectAndAddCensusSelection ref="SelectAndAddCensusSelection" @emitAll="setHostFamilys" append-to-body></SelectAndAddCensusSelection>
	</div>
</template>
<script>
import SelectAddress from '@/components/SelectAddress/index.vue';
import SelectAndAddCensus from '../SelectAndAddCensus/index.vue';
import SelectAndAddCensusSelection from '../SelectAndAddCensus/selection.vue';
import ApiCooperativeFarmerManage from '@/api/nzjc/cooperativeFarmerManage.js';
import selectMixin from '../../selectMixin.js';

export default {
	mixins: [selectMixin],
	data() {
		return {
			farmerId: '',
			show: false,
			// Form: {
			// 	hostId: '',//户主 id
			// 	annualIncome: '10000', //家庭年收入
			// 	agriculturalIncome: '10000', //农业收入
			// 	house: 1, //住房情况
			// 	houseArea: '120', //住房面积
			// 	houseBaseArea: '100', //宅基地面积
			// 	paddyFieldArea: '100', //水田面积
			// 	irrigatedLandArea: '100', //灌溉地面积
			// 	grassLandArea: '100', //牧草地面积
			// 	dryLandArea: '100', //旱田面积
			// 	shrubberyArea: '100', //灌木林面积
			// 	sparseWoodlandArea: '100', //疏林地面积
			// 	traceWoodlandArea: '100', //迹地面积
			// 	nurseryArea: '100', //苗圃面积
			// 	lakeArea: '100', //湖面面积
			// 	poolArea: '100' ,//池塘面积
			// 	farmerUserIdList:[],
			// },
			Form: {
				hostId: '', //户主 id
				annualIncome: '', //家庭年收入
				agriculturalIncome: '', //农业收入
				house: 0, //住房情况
				houseArea: '', //住房面积
				houseBaseArea: '', //宅基地面积
				paddyFieldArea: '', //水田面积
				irrigatedLandArea: '', //灌溉地面积
				grassLandArea: '', //牧草地面积
				dryLandArea: '', //旱田面积
				shrubberyArea: '', //灌木林面积
				sparseWoodlandArea: '', //疏林地面积
				traceWoodlandArea: '', //迹地面积
				nurseryArea: '', //苗圃面积
				lakeArea: '', //湖面面积
				poolArea: '', //池塘面积
				farmerUserIdList: []
			},
			Rules: {
				// userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
			},
			radioSex: [{ index: 1, label: '男' }, { index: 2, label: '女' }],
			radioHealth: [{ index: 1, label: '良好' }, { index: 2, label: '一般' }, { index: 3, label: '欠佳' }],
			radioPoliticalStatus: [{ index: 1, label: '中共党员' }, { index: 2, label: '群众' }],
			selectHouse: [
				{ value: 0, label: '无' },
				{ value: 1, label: '楼房' },
				{ value: 2, label: '平房' },
				{ value: 3, label: '瓦房' },
				{ value: 4, label: '危房' },
				{ value: 5, label: '其他' }
			],
			users: [],
			familys: []
		};
	},
	components: {
		SelectAddress,
		SelectAndAddCensus,
		SelectAndAddCensusSelection
	},
	computed: {
		isChange() {
			return !!this.farmerId;
		},
		dialogTitle() {
			return !this.isChange ? '新增户籍' : '修改户籍';
		}
	},
	mounted() {},
	methods: {
		setHostUser(val) {
			this.users = val;
			this.Form.hostId = val[0].id;
			this.familys = this.familys
				.map(item => {
					// console.log(item.id , val[0].id)
					// console.log(item.id != val[0].id)
					if (item.id != val[0].id) {
						return item;
					}
				})
				.filter(item => !!!item == false);
			console.log(this.familys);
		},
		setHostFamilys(val) {
			let familys = this.familys;
			let noHostUser = val
				.map(item => {
					if (item.id != this.Form.hostId) {
						return item;
					}
				})
				.filter(item => !!!item == false); //过滤户主
			let familysIds = familys.map(item => item.id);
			let add = noHostUser.filter(item => !familysIds.includes(item.id));
			this.familys = [].concat(add, familys);
		},
		submit() {
			this.$refs['Form'].validate(async valid => {
				if (valid) {
					let id = this.cooperativeInfo.id;
					let params = {
						...this.Form,
						cooperativeId:id,
					};
					// params.cooperativeId = 2;
					params.farmerUserIdList = this.familys.map(item => {
						return item.id;
					});
					let code = 0;
					!this.isChange ? (code = await this.addFarmer(params)) : (code = await this.updateFarmerById(params));
					if (code == 10200) {
						this.show = false;
						this.$emit('success');
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		async addFarmer(params) {
			let { code, data } = await ApiCooperativeFarmerManage.addFarmer(params);
			return code;
		},
		async updateFarmerById(params) {
			let { code, data } = await ApiCooperativeFarmerManage.updateFarmerById(this.farmerId, params);
			return code;
		},
		async open(farmerId) {
			console.log(farmerId);
			if (farmerId) {
				// let params = {
				// 	// cooperativeId:2,
				// 	farmerId: farmerId
				// };
				let { code, data } = await ApiCooperativeFarmerManage.selectFarmerInfoById(farmerId);
				Object.keys(this.Form).forEach(key => {
					this.Form[key] = data[key];
				});
				data['farmerUserInfoVoList'].map(item => {
					if (!item.isHost) {
						this.familys.push(item);
					} else {
						this.users.push(item);
					}
				});
				this.farmerId = farmerId;
			}
			this.show = true;
		},
		close() {
			this.farmerId = '';
			this.users = [];
			this.familys = [];
			// this.$refs['SelectAddress'].emptyData();
			this.emptyForm();
		},
		addCensus(dislogName) {
			this.$refs[dislogName].open();
		}
	}
};
</script>
<style lang="scss">
.add-member .el-input-number .el-input.el-input--medium input {
	text-align: left !important;
}
</style>
<style lang="scss" scoped="scoped">
.grid-form-items {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	.el-input-number {
		width: 120px;
		margin-right: 10px;
	}
}
.people {
	display: flex;
	flex-wrap: wrap;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 10px;
	p {
		background-color: #f0f0f0;
		font-size: 14px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
		margin-right: 10px;
		margin-bottom: 10px;
		span {
			margin-right: 10px;
		}
	}
	.el-button {
		width: fit-content;
		max-height: 36px;
	}
	i {
		cursor: pointer;
	}
}
.submit-button {
	min-width: 120px;
}

.el-form > .el-form-item .el-input-number,
.el-form > .el-form-item .el-select {
	width: 260px;
}
.el-form > .el-form-item .el-form-item__content {
	display: flex;
	.el-input {
		margin-right: 10px;
	}
}

.familys {
	// display: grid;
	// grid-template-columns: repeat(3, 1fr);
	// grid-gap: 10px;
	.el-radio {
		// line-height: 36px;
		// margin: 0;
		margin-right: 10px;
		margin-left: 0;
		margin-bottom: 10px;
	}
	.el-button {
		width: fit-content;
		max-height: 36px;
	}
}
</style>
