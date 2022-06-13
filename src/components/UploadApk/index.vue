<template>
	<el-upload
		class="upload"
		ref="upload"
		action
		:http-request="uploadApk"
		:list-type="uploadConfig.listType"
		:on-exceed="exceed"
		:on-change="onFrontImgChange"
		:on-progress="uploadProcess"
		:accept="uploadConfig.accept"
		:file-list="uploadConfig.fileList"
		:auto-upload="uploadConfig.autoUpload"
		:limit="uploadConfig.limit"
		:multiple="uploadConfig.multiple"
	>
		<el-button size="small" type="primary" :disabled="isLoding">
			点击上传
			<el-icon v-show="isLoding" class="el-icon-loading"></el-icon>
		</el-button>
		<div class="el-upload__tip" slot="tip"><el-progress v-show="isLoding" :percentage="progressPercent"></el-progress></div>
	</el-upload>
</template>
<script>
import Api from '@/api/system/user.js';

export default {
	data() {
		return {
			isLoding: false,
			uploadConfig: {
				accept: '.apk',
				limit: 1,
				listType: 'text',
				multiple: false,
				autoUpload: false,
				fileList: []
			},
			progressPercent: 0
		};
	},
	props: {
		filePath: {
			// v-model="filePath"
			type: String,
			default: ''
		},
		moduleName: { //moduleName="culture" moduleName="silver"
			type: String,
			default: '',
			validator: function(value) {
				// 这个值必须匹配下列字符串中的一个
				return ['culture', 'silver'].indexOf(value) !== -1;
			}
		}
	},
	model: {
		prop: 'filePath',
		event: 'emitApkPath'
	},
	methods: {
		regexpFileName(str) {
			return new RegExp(/^([a-z_A-Z-.+0-9]+)$/).test(str);
		},
		async getOssInfo() {
			let params = {
				moduleName: this.moduleName,
				fileType: 'apk'
			};
			let { code, data, msg } = await Api.ossPolicy(params);
			if (code === 10200) {
				return data;
			} else {
				return false;
			}
		},
		async uploadApk() {
			let oss = await this.getOssInfo();
			if (oss === false) {
				return this.$message.warning('获取oss签名失败');
			} else {
				this.isLoding = true;
				let fileList = this.$refs['upload'].uploadFiles; //获取上传图片的数组
				// let fileListCompress = this.uploadConfig.fileList;
				if (fileList.length <= 0) {
					return this.$message.warning('获取文件失败');
				}
				let { accessid, expire, host, dir, policy, signature,url } = oss;
				let config = {
					header: { 'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime() },
					onUploadProgress: progressEvent => {
						this.progressPercent = Number(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2));
					}
				};
				const apkFile = fileList[0];
				const fileName = new Date().getTime() + '_' + apkFile.name;
				let param = new FormData(); // 创建form对象
				param.append('OSSAccessKeyId', accessid);
				param.append('policy', policy);
				param.append('key', dir + '/' + fileName);
				param.append('success_action_status', 200);
				param.append('signature', signature);
				param.append('file', apkFile.raw, fileName);
				let res = await this.$axios.post(host, param, config);
				let filePath = `${url}/${dir}/${fileName}`;
				console.log(res);
				if (res.status === 200) {
					this.$emit('emitApkPath', filePath);
				} else {
					this.$message.error('上传失败');
				}
				this.isLoding = false;
				console.log(filePath);
			}
		},
		emptyFiles() {
			//清空上传列表
			this.$refs['upload'].clearFiles();
		},
		exceed(files, fileList) {
			this.$message.warning('文件超出个数限制，最多' + this.uploadConfig.limit + '个');
		},
		uploadProcess(event, file, fileList) {
			console.log('uploadProcess', event);
		},
		async onFrontImgChange(file, fileList) {
			console.log();
			let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
			if (!this.regexpFileName(fileName)) {
				this.emptyFiles();
				return this.$message.error('文件名非法,只能包含英文字母，数字，下划线，横线，加号及点。');
			}
			this.$refs['upload'].submit();
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
.upload {
	& > div:first-child {
		display: flex;
		.el-button {
			display: block;
			width: fit-content;
			margin: 0 0 0 auto;
		}
	}
}
</style>
<style lang="scss">
.el-progress .el-progress-bar {
	max-width: 300px;
}
</style>
