<template>
<!-- 	<div>
		{{uploadConfig.fileList}}
	</div> -->
	<el-upload
		:class="[{ small: small == true }]"
		ref="upload"
		action=""
		:list-type="uploadConfig.listType"
		:on-exceed="exceed"
		:on-change="onFrontImgChange"
		:accept="uploadConfig.accept"
		:file-list="uploadConfig.fileList"
		:auto-upload="uploadConfig.autoUpload"
		:limit="uploadConfig.limit"
		:multiple="uploadConfig.multiple"
		:before-remove="beforeRemove"
	>
		<i class="el-icon-plus">
			<p v-show="!small">{{ tipText }}</p>
		</i>
		<div class="el-upload__tip" slot="tip">
			<!-- <el-button v-show="limit != 1" @click="uploadImg">上传文件</el-button> -->
			<slot name="tip"></slot>
		</div>
	</el-upload>
</template>
<!--
	<UploadImg ref="uploadCircleImageSmall" moduleName="web" v-model="Form.circleImageSmall"></UploadImg>
	<UploadImg
		ref="uploadImgBig"
		moduleName="web"
		immediately
		@imageUrls="
			urls => {
				Form.imageBig = urls[0];
			}
		"
	></UploadImg>
 -->
<script>
import SparkMD5 from 'spark-md5';
import Api from '@/api/auth/oss.js';
import axios from 'axios';
// import { compress } from '@/utils/compressImage.js';
import { compress } from './compressImage.js';
// import axios from "axios"
export default {
	data() {
		return {
			/*上传图片*/
			uploadConfig: {
				accept: '.jpg,.jpeg,.png',
				limit: this.limit,
				// listType: 'picture',
				listType: 'picture-card',
				multiple: this.limit > 1 ? true : false,
				autoUpload: false,
				// fileList:[{url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'}]
				fileList: []
			},
			md5List: [] // 图片md5的hash签名
		};
	},
	props: {
		moduleName: {
			type: String,
			default: '',
			validator: function(value) {
				// 这个值必须匹配下列字符串中的一个
				return ['web', 'nzjc', 'ncq'].indexOf(value) !== -1;
			}
		},
		limit: {
			//上传文件数量限制
			type: Number,
			default: 1,
			validator(value) {
				//必须大于0
				return value > 0;
			}
		},
		maxSize: {
			//单个文件大小
			type: Number,
			default: 3
		},
		imageUrlList: {
			type: [Array, String],
			// default: () => [{url:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'}]
			default: () => []
		},
		tipText: {
			//提示文字
			type: String,
			default: ''
		},
		small: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		'uploadConfig.fileList'(newArr, oldArr) {
			if (newArr !== null) {
				let uploadCard = this.$refs['upload'].$refs['upload-inner'].$el;
				if ((this.immediately && newArr.length > 0) || this.limit <= newArr.length) {
					uploadCard.style.display = 'none';
					// console.log(uploadCard.style);
				} else {
					// let timer =
					setTimeout(() => {
						uploadCard.style.display = 'inline-block';
					}, 900);
				}
			}
		}
		// el-upload
	},
	computed: {
		immediately() {
			return this.limit == 1 && this.uploadConfig.fileList.length > 0;
		}
	},
	model: {
		prop: 'imageUrlList',
		event: 'imageUrls'
	},
	// async mounted() {
	// 	let uploadCard = this.$refs['upload'].$refs['upload-inner'];
	// 	console.log(uploadCard)
	// 	// console.log('immediately',this.immediately)
	// 	// this.uploadConfig.fileList = this.imageUrlList;

	// 	// let oss = await this.getOssInfo();
	// 	// console.log(oss)
	// },
	methods: {
		async getOssInfo() {
			let params = {
				//moduleName="culture" moduleName="silver"
				moduleName: this.moduleName,
				fileType: 'image'
			};
			let { code, data, msg } = await Api.getOssPolicy(params);
			if (code === 10200) {
				return data;
			} else {
				return false;
			}
		},
		async uploadImg() {
			// this.emptyFiles();
			console.log('上传图片');
			let oss = await this.getOssInfo();
			// console.log(oss)
			if (oss == false) {
				return this.$message.warning('获取oss签名失败');
			} else {
				let fileList = this.$refs['upload'].uploadFiles; //获取上传图片的数组
				if (fileList.length <= 0) {
					this.$message.warning('获取文件失败');
					return null;
				}
				// console.log("未过滤的列表",fileList)
				let filterList = fileList.filter(item=>!!item.raw);//过滤掉没有Uid的文件
				// console.log("过滤的列表",filterList)
				let list=[]
				if(filterList.length>0) {
					list = await this.uploadApi(oss, filterList);
				} else {
					list = filterList.map(item=>item.url)
				}
				if (this.immediately) {
					this.$emit('imageUrls', list[0]); //提交图片url列表
				} else {
					this.$emit('imageUrls', list); //提交图片url列表
				}
				return list;
			}
		},
		async uploadApi(oss, files) {
			let list = []; //图片url 数组
			// console.log('uploadImg', files);
			let { accessId, expire, host, dir, policy, signature, url } = oss;
			let config = {
				header: { 'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime() }
				// withCredentials: false,
			};
			for (let i = 0; i < files.length; i++) {
				const { status, name, size, raw, percentage, uid } = files[i]; //解耦文件对象
				// console.log( status, name, size, raw, percentage, uid, url )
				const hash = this.md5List[i];
				if (!hash) {
					return this.$message.warning('hash丢失');
				}
				const Extension = this.getExtensionWithPoint(name); //图片后缀名
				const fileName = new Date().getTime() + '_' + hash + Extension;
				// console.log( name, fileName )
				let val = await compress(raw);
				let newfile = new window.File([val], name, { type: raw.type });
				newfile.uid = uid;
				//命名文件 时间戳+哈希码
				let param = new FormData(); // 创建form对象
				param.append('OSSAccessKeyId', accessId);
				param.append('policy', policy);
				param.append('key', dir + '/' + fileName);
				param.append('success_action_status', 200);
				param.append('signature', signature);
				param.append('file', newfile, fileName);
				//提交文件
				let res = await axios.post(host, param, config);
				if (res.status === 200 || res.status === 10200) {
					list.push(`${url}/${dir}/${fileName}`);
				}
				console.log(list);
			}
			return list;
		},
		beforeRemove(file, row) {
			this.$emit('remove');
			// console.log(file,row)
			if(this.immediately) {
				this.$emit('imageUrls','')
			}
			this.uploadConfig.fileList = row;
			return true;
		},
		emptyFiles() {
			//清空上传列表和md5列表
			this.uploadConfig.fileList = [];
			this.$refs['upload'].clearFiles();
			this.md5List = [];
			// console.log(this.md5List,this.uploadConfig.fileList)
			// console.log("清空")
			// this.uploadConfig.fileList = [];
		},
		exceed(files, fileList) {
			this.$message.warning('文件超出个数限制，最多' + this.uploadConfig.limit + '个');
		},
		async onFrontImgChange(file, fileList) {
			const _this = this;
			let size = file.size / 1024 / 1024;
			if (size > this.maxSize) {
				return this.$notify.warning({
					title: '警告',
					message: `文件大小不得超过${this.maxSize}M`
				});
			} else {
				let fileReader = new FileReader();
				let dataFile = file.raw;
				// let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
				let spark = new SparkMD5.ArrayBuffer();
				//获取文件二进制数据
				fileReader.readAsArrayBuffer(dataFile);
				//异步执行函数
				fileReader.onload = function(e) {
					spark.append(e.target.result);
					let md5 = spark.end();
					//将根据文件生成的hash码丢入数组里，命名文件时再用。
					_this.md5List.push(md5);
				};
				// console.log(file,fileList)
				this.uploadConfig.fileList = fileList;
				// console.log(this.uploadConfig.fileList)

				if (this.immediately === true) {
					this.uploadImg();
					this.md5List = [];
				}
			}
		},
		getFileList() {
			return this.uploadConfig.fileList;
		},
		setFileList(arr, key) {
			if (typeof arr == 'string') {
				// console.log(typeof(arr))
				this.uploadConfig.fileList = [{ url: arr }];
				return;
			}
			console.log('uploadImg - array>', arr);
			this.uploadConfig.fileList = arr.map(item => {
				return !key ? { url: item } : { url: item[key] };
			});
		},
		removeFileList() {
			this.uploadConfig.fileList = [];
		},
		// 获取文件名
		getFileName(name) {
			return name.substring(0, name.lastIndexOf('.'));
		},
		// 获取 .后缀名
		getExtensionWithPoint(name) {
			return name.substring(name.lastIndexOf('.'));
		},
		// 只获取后缀名
		getExtension(name) {
			return name.substring(name.lastIndexOf('.') + 1);
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
::v-deep .el-upload--picture-card {
	margin: 0 0.5rem 0.5rem 0;
}
::v-deep .el-upload--picture-card,
::v-deep .el-upload-list--picture-card .el-upload-list__item {
	// width: 3rem;
	// height: 3rem;
	// line-height: 3rem;
	i {
		font-size: 1rem;
	}
}
.small {
	::v-deep .el-upload--picture-card,
	::v-deep .el-upload-list--picture-card .el-upload-list__item {
		width: 3rem;
		height: 3rem;
		line-height: 3rem;
	}
}
</style>
