<template>
	<div class="select-address">
		<ul flex v-if="AddressJsonIsOnLoad">
			<li >
				<el-select v-model="addressNo.provinceRegionNo" placeholder="请选择省地域" clearable filterable  @change="setCityRegionList">
					<el-option v-for="item in provinceRegionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</li>
			<li>
				<el-select v-model="addressNo.cityRegionNo" placeholder="请选择城市地域" clearable filterable  @change="setAreaRegionList">
					<el-option v-for="item in cityRegionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					<el-option v-show="cityRegionList.length <= 0" label="请选择省地区" value="0"></el-option>
				</el-select>
				<!-- <span v-else>未选择省地域</span> -->
				<!-- <el-select v-else v-model="addressNo.cityRegionNo" placeholder="请选择省地域" clearable filterable><el-option label="请选择省地区" value="0"></el-option></el-select> -->
			</li>
			<li>
				<el-select v-model="addressNo.areaRegionNo" placeholder="请选择区地域" clearable filterable @change="getAreas">
					<el-option v-for="item in areaRegionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					<el-option v-show="areaRegionList.length <= 0" label="请选择区地域" value="0"></el-option>
				</el-select>
				<!-- <span v-else>未选择城市</span> -->
				<!-- <el-select v-else v-model="addressNo.areaRegionNo" placeholder="请选择区地域" clearable filterable><el-option label="请选择区地域" value="0"></el-option></el-select> -->
			</li>
		</ul>
		<span v-else>数据加载失败</span>
	</div>
</template>
<script>
import AddressJson from '@/utils/json/city2.json';
export default {
	data() {
		return {
			AddressJson: AddressJson, //地区选择json数据
			provinceRegionList: [], //	integer($int32) 省地域编号
			cityRegionList: [], //		integer($int32) 城市地域编号
			areaRegionList: [], //		integer($int32) 区地域编号
			addressNo: {
				provinceRegionNo: null, //	integer($int32) 省地域编号
				cityRegionNo: null, //		integer($int32) 城市地域编号
				areaRegionNo: null //		integer($int32) 区地域编号
			},
		};
	},
	components: {},
	computed: {
		AddressJsonIsOnLoad() {
			return this.provinceRegionList.length > 0
		}
	},
	props:{
		cityNos:{
			type:Array,
		}
	},
	model:{
		prop:"cityNos",
		event:"emitCityNo",
	},
	created() {
		this.setProvinceRegionList();
		if(this.cityNos.length == 3) {
			this.startAreas(this.cityNos)
		}
		// console.log('cityNos',this.cityNos)
	},
	methods: {
		startAreas(cityNos) {
			this.addressNo.provinceRegionNo = cityNos[0];
			this.setCityRegionList(cityNos[0])
			this.addressNo.cityRegionNo = cityNos[1];
			this.setAreaRegionList(cityNos[1])
			this.addressNo.areaRegionNo = cityNos[2];
		},
		getAreas() {
			let arr = Object.values(this.addressNo);
			this.$emit('emitCityNo', arr)
			// this.getAddress()
			let label1 = this.provinceRegionList.filter(item=>item.value == arr[0])
			let label2 = this.cityRegionList.filter(item=>item.value == arr[1])
			let label3 = this.areaRegionList.filter(item=>item.value == arr[2])
			// console.log(label1,label2,label3)
			let labels = [].concat(label1,label2,label3).map(item=>{
				return item.label;
			}).join(' ');
			// console.log(labels)
			this.$emit('emitAddress',labels)
		},
		emptyData() {
			this.addressNo.provinceRegionNo = null;
			this.addressNo.cityRegionNo = null;
			this.addressNo.areaRegionNo = null;
			this.cityRegionList = [];
			this.areaRegionList = [];
		},
		splitStr(str) {
			let arr = str.split(',');
			arr[1] = Number(arr[1]);
			return arr;
		},
		setProvinceRegionList() {
			//设置省区选择框
			//设置省选择项
			let AddressJson = this.AddressJson;
			if (AddressJson.length > 0) {
				let list = [];
				AddressJson.forEach(item => {
					// console.log(item.name)
					let arr = this.splitStr(item.name);
					list.push({
						label: arr[0],
						value: arr[1],
						cityList: item.cityList
					});
				});
				this.provinceRegionList = list;
				// console.log(list);
			}
		},
		setCityRegionList(pValue) {
			//设置城市 选择框
			this.addressNo.cityRegionNo = null;
			this.addressNo.areaRegionNo = null;
			this.cityRegionList = [];
			this.areaRegionList = [];
			// console.log('取消地域', this.cityRegionList, this.addressNo.cityRegionNo);
			// console.log('取消区', this.areaRegionList, this.addressNo.areaRegionNo);
			//设置城市选择项
			// console.log("setCityRegionList",pValue);
			if (!!pValue) {
				let provinceRegionList = this.provinceRegionList;
				provinceRegionList.forEach(proItem => {
					if (proItem.value === pValue) {
						let list = [];
						proItem.cityList.forEach(cityItem => {
							let arr = this.splitStr(cityItem.name);
							list.push({
								label: arr[0],
								value: arr[1],
								areaList: cityItem.areaList
							});
						});
						this.cityRegionList = list;
						// console.log(list);
					}
				});
			}
		},
		setAreaRegionList(cValue) {
			//设置区域选择框
			this.addressNo.areaRegionNo = null;
			this.areaRegionList = [];
			// console.log('取消区', this.areaRegionList, this.addressNo.areaRegionNo);
			// 设置区选择项
			// console.log("setAreaRegionList-->",cValue);
			// areaRegionList
			if (!!cValue) {
				let cityRegionList = this.cityRegionList;
				cityRegionList.forEach(cityItem => {
					if (cityItem.value === cValue) {
						// console.log(cityItem);
						let list = [];
						cityItem.areaList.forEach(areaItem => {
							// console.log(areaItem);
							let arr = this.splitStr(areaItem);
							list.push({
								label: arr[0],
								value: arr[1]
							});
						});
						this.areaRegionList = list;
						// console.log(list);
					}
				});
			}
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
li:not(:last-child) {
	margin-right: 0.625rem;
}
// .el-select {
	// max-width: 146px;
// }
</style>
