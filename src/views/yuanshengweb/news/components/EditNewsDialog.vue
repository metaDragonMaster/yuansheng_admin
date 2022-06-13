<template>
	<el-dialog :title="dialogTitle" :visible.sync="show" top="6vh" width="980px" :close-on-click-modal="false" append-to-body @closed="close">
		<!-- {{newsId}} -->
		<!-- {{Form}} -->
		<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
			<el-form-item prop="newsAuthor" label="作者昵称">
				<el-input v-model="Form.newsAuthor"></el-input>
			</el-form-item>
			<el-form-item prop="newsTitle" label="资讯标题">
				<el-input v-model="Form.newsTitle"></el-input>
			</el-form-item>
			<el-form-item prop="newsTypeId" label="新闻资讯类型">
				<el-select v-model="Form.newsTypeId"><el-option v-for="item in selectNewsType" :key="item.newsTypeId" :value="item.newsTypeId" :label="item.newsTypeName"></el-option></el-select>
			</el-form-item>
			<el-form-item prop="platformTypeId" label="平台类型">
				<el-select v-model="Form.platformTypeId"><el-option v-for="item in selectPlatformType" :key="item.platformTypeId"  :value="item.platformTypeId" :label="item.platformTypeName"></el-option></el-select>
			</el-form-item>
			<el-form-item prop="newsTitleImage" label="封面">
				<uploadImg
					ref="UploadImg"
					moduleName="web"
					v-model="Form.newsTitleImage"
				></uploadImg>
			</el-form-item>
			<el-form-item prop="isRelease" label="是否发布">
				<el-radio v-model="Form.isRelease" :label="true">是</el-radio>
				<el-radio v-model="Form.isRelease" :label="false">否</el-radio>
			</el-form-item>
			<el-form-item prop="newsContent" label="资讯内容">
				<!-- <el-button @click="$refs['Editor'].startEditor()">打开编辑器</el-button> -->
				<WangEditor ref="Editor" v-model="Form.newsContent"/>
			</el-form-item>
		</el-form>
		<div drift-right>
			<el-button class="submit-button " type="success" @click="submit">提交</el-button>
			<el-button @click="show = false">返回</el-button>
		</div>
	</el-dialog>
</template>
<script>
import Api from '@/api/yuanshengweb/news.js';
import FormUtil from "@/utils/formUtil.js";

import WangEditor from "@/components/WangEditor/index.vue";
import UploadImg from "@/components/UploadImg/index.vue";

export default {
	props:{
		selectNewsType:{
			type:Array,
			default:()=>[],
		},
		selectPlatformType:{
			type:Array,
			default:()=>[],
		},
	},
	data() {
		return {
			newsId: '',
			show: false,
			Form: {
				isRelease:true,//	是否发布	query	false	boolean
				newsAuthor:"",//	作者(转载)	query	false	string
				newsContent:"",//	内容	query	false	string
				newsTitle:"",//	标题	query	false	string
				newsTitleImage:"",//	标题图片	query	false	string
				newsTypeId:"",//	新闻类型ID	query	false	integer(int32)
				platformTypeId:"",//	平台类型ID	query	false	integer(int32)
			},
			Rules: {
				// userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
			},
		};
	},
	components: {
		WangEditor,
		UploadImg,
	},
	computed: {
		isChange() {
			return !!this.newsId;
		},
		dialogTitle() {
			return !this.isChange ? '新增户籍' : '修改户籍';
		}
	},
	mounted() {},
	methods: {
		submit() {
			this.$refs['Form'].validate(async valid => {
				if (valid) {
					let params = {
						...this.Form,
					};
					let code = 0;
					!this.isChange ? (code = await this.addNewsInfo(params)) : (code = await this.updateNewsInfoById(params));
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
		async addNewsInfo(params) {
			let { code, data } = await Api.addNewsInfo(params);
			return code;
		},
		async updateNewsInfoById(params) {
			console.log(this.newsId)
			let { code, data } = await Api.updateNewsInfoById(this.newsId, params);
			return code;
		},
		async open(row) {
			console.log(row);

			this.show = true;
			this.$nextTick(()=>{
				if (row) {
					this.newsId = row.newsId;
					this.Form = FormUtil.combineAttrs(this.Form,row);
				}
				this.$refs['Editor'].startEditor();
				if(row.newsTitleImage) {
					this.$refs['UploadImg'].setFileList(row.newsTitleImage);
				}
			})
		},
		close() {
			this.$nextTick(()=>{
				this.$refs['Editor'].destroyEditor();
				this.$refs['UploadImg'].removeFileList();
				this.newsId='';
				// this.Form = {
				// 	isRelease:true,//	是否发布	query	false	boolean
				// 	newsAuthor:"",//	作者(转载)	query	false	string
				// 	newsContent:"",//	内容	query	false	string
				// 	newsTitle:"",//	标题	query	false	string
				// 	newsTitleImage:"",//	标题图片	query	false	string
				// 	newsTypeId:"",//	新闻类型ID	query	false	integer(int32)
				// 	platformTypeId:"",//	平台类型ID	query	false	integer(int32)
				// }
			})
			this.emptyForm();
		},
	}
};
</script>
<style lang="scss" scoped="scoped">
</style>
