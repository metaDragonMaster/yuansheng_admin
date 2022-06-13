<template>
	<el-autocomplete v-model="value" @input="change" :trigger-on-focus="false" :fetch-suggestions="querySearch" :placeholder="placeholder" clearable></el-autocomplete>
</template>
<script>
export default {
	data(){return{
		value:'',
	}},
	model:{
		prop: 'emailValue',
		event: 'emitValue',
	},
	props:{
		emailValue:{
			type: String,
			required: true,
		},
		emailList:{
			type: Array,
			default:()=>{
				return  [
					{ value: '@qq.com' },
					{ value: '@126.com' },
					{ value: '@163.com' },
					{ value: '@sina.com' },
					{ value: '@21cn.com' },
					{ value: '@sohu.com' },
					{ value: '@yahoo.com.cn' },
					{ value: '@tom.com' },
					{ value: '@etang.com' },
					{ value: '@eyou.com' },
					{ value: '@56.com' },
					{ value: '@x.cn' },
					{ value: '@chinaren.comsogou.com' },
					{ value: '@citiz.com' }
				]
			}
		},
		placeholder:{
			type: String,
			default: '请输入邮箱',
		},
	},
	watch:{
		emailValue(newVal) {
			if(!newVal) {
				this.value = '';
			}
		}
	},
	mounted() {
		// console.log('email input',this.emailValue);
		this.value = this.emailValue;
	},
	methods:{
		change(val) {
			// console.log('change', this.value);
			this.$emit('emitValue',this.value);
		},
		querySearch(queryString, callback) {
			const emailList = this.emailList;
			let results = [];
			// TODO
			if (queryString.includes('@')) {
				for (let i in emailList) {
					let length = queryString.indexOf("@");
					let have = emailList[i].value.includes(queryString.substr(length).toLowerCase());
					if(have) {
						let value = queryString.slice(0,length) + emailList[i].value;
						results.push({
							value:value
						});
					}
				}
			} else {
				results = emailList.map(item => {
					return {
						value:queryString + item.value
					};
				});
				console.log(results);
				callback(results);
			}
			callback(results);
		},
	}
}
</script>
<style  lang="scss" scoped="scoped">

</style>
