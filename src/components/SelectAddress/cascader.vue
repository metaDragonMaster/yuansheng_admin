<template>
	<!-- <div> -->
		<el-cascader v-model="addressData" :options="options" @change="handleChange"></el-cascader>
		<!-- {{addressData}} -->
	<!-- </div> -->
</template>
<script>
import chinaData from '@/utils/json/chinaData.json';
export default {
	data() {
		return {
			addressData: [],
			options: chinaData,
		};
	},
	components: {},
	computed: {},
	props: {
		value: {
			type: [String, Array],
			default: ''
		},
		type:{
			type:String,
			default:'array',
			validator(val) {
				let Arr = [
					'array',
					'string'
				]
				return Arr.includes(val.toLocaleLowerCase());
			}
		}
	},
	model: {
		prop: 'value',
		event: 'emitValue'
	},
	watch:{
		value(newVal,oldVal) {
			// if(typeof(newVal) == 'string' && newVal.length>0) {
			// 	this.addressData = newVal.split(',');
			// } else {
			// 	this.addressData = newVal
			// }
			this.startData(newVal)
		},
	},
	mounted() {
		// console.log(this.value);
		this.startData(this.value);
	},
	methods: {
		startData(val) {
			if(typeof(val) == 'string') {
				this.addressData = val.split(',');
			} else {
				this.addressData = val
			}
		},
		handleChange(value) {
			// console.log(value);
			if(this.type == 'array') {
				this.$emit('emitValue', value);
			}
			if(this.type == 'string') {
				let val = value.join(',');
				this.$emit('emitValue', val);
			}
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
.el-cascader {
	width: 100%;
}
</style>
