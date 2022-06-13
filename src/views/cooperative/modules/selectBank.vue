<template>
	<div>
		<!-- {{bankName}}/ -->
		<!-- {{value}} -->
		<el-select v-model="bankName" placeholder="请输入关键词搜索" filterable remote reserve-keyword @change="changeSelect" :remote-method="selectBankInfo" :loading="loading">
			<el-option v-for="item in selectHeadOffice" :key="item.bankCode" :label="item.bankName" :value="item.bankCode"></el-option>
		</el-select>
	</div>
</template>
<script>
import Api from "@/api/nzjc/cooperativeManage.js"
export default {
	data(){return{
		loading: false,
		bankName:"1000",
		selectHeadOffice:[],
	}},
	model:{
		prop:"value",
		event:"emitValue"
	},
	props:{
		value:{
			type:String,
			default:""
			// required:true,
		},
	},
	watch:{
		value(newVal,oldVal) {
			if(oldVal) {
				this.startData(newVal)
			}
		},
	},
	mounted() {
		this.startData(this.value);
		// this.startData("1000");
		// this.selectBankInfo()
	},
	methods:{
		startData(val) {
			console.log("select bank -- ",this.value)
			this.bankName = val;
		},
		changeSelect(val) {
			this.$emit('emitValue',val);
		},
		async selectBankInfo(value) {
			// if(!!!value) return;
			this.loading = true;
			let { code, data } = await Api.selectBankInfo({
				bankName: value
				// bankName: "中国建设银行"
			});
			this.selectHeadOffice = data;
			this.loading = false;
		},
	}
}
</script>
<style  lang="scss" scoped="scoped">
.el-select {
	width: 100%;
}
</style>
