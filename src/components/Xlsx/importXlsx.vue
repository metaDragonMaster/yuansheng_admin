<template>
	<div class="importXlsx">
		<input
			type="file"
			@change="importFile()"
			ref="importFileDom"
			style="display: none"
			accept=".xlsx,.csv,.excel"
		/>
		<el-button class="button" @click="uploadFile()" :icon="icon">
			{{text}}
		</el-button>
	</div>
</template>

<script>
import XLSX from 'xlsx';
export default {
	name: 'Index',
	data() {
		return {
		};
	},
	model: {
		prop: 'dataList',
		event: 'importFile'
	},
	props:{
		icon:{
			type:String,
			default:""
		},
		text:{
			type:String,
			default:"导入"
		},
		dataList:{
			type:Array,
			default:()=>[]
		}
	},
	methods: {
		emptyFile(){ //清空input文件内容
			this.$refs['importFileDom'].value = null;
		},
		uploadFile() {
			// 点击导入按钮
			this.$refs['importFileDom'].click();
		},
		importFile() {
			// 导入excel
			let obj = this.$refs['importFileDom'];
			let f = obj.files[0];
			let reader = new FileReader();
			let $t = this;
			reader.onload = function(e) {
				let data = e.target.result;
				$t.wb = XLSX.read(data, {
					type: 'binary'
				});
				let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]]);
				$t.$emit('importFile',json)
			};
			reader.readAsBinaryString(f);
		},
	}
};
</script>
