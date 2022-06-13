<template>
	<div id="wang-Editor"></div>
</template>

<script>
import SparkMD5 from 'spark-md5';
import Api from '@/api/auth/oss.js';
import wangEditor from 'wangeditor';
import axios from "axios";
import { compress } from './compressImage.js';
export default {
	data() {
		return {
			editor: null
		};
	},
	props: {
		start: {
			//是否自动启动
			type: Boolean,
			default: false
		},
		content: {
			//编辑内容
			type: String,
			default: ''
		},
		moduleName:{
			type: String,
			default: 'web',
			validator: function(value) {
				// 这个值必须匹配下列字符串中的一个
				return ['web', 'nzjc','ncq'].includes(value);
			}
		},
	},
	model: {
		// 可以用v-model绑定编辑内容
		prop: 'content',
		event: 'newHtml'
	},
	mounted() {
		if (this.start) {
			this.startEditor();
		}
	},
	beforeDestroy() {
		//销毁编辑器
		this.destroyEditor();
	},
	methods: {
		initChange() {
			this.editor = new wangEditor('#wang-Editor');
			const that = this;
			//修改内容回调的延迟触发时间
			this.editor.config.onchangeTimeout = 500;
			this.editor.config.height = 580;
			this.editor.config.showFullScreen = false;
			// this.editor.config.excludeMenus = ['emoticon', 'video', 'table','indent','check']
			this.editor.config.menus = [
				'head', // 标题
				'bold', // 粗体
				'fontSize', // 字号
				'fontName', // 字体
				'italic', // 斜体
				'underline', // 下划线
				'strikeThrough', // 删除线
				'foreColor', // 文字颜色
				'backColor', // 背景颜色
				'link', // 插入链接
				'list', // 列表
				'justify', // 对齐方式
				'quote', // 引用
				// 'emoticon', // 表情
				'image', // 插入图片
				// 'table', // 表格
				// 'video',  // 插入视频
				// 'code', // 插入代码
				'undo', // 撤销
				'redo' // 重复
			];
			this.editor.config.fontSizes = {
				'x-small': { name: '12px', value: '1' },
				'small': { name: '14px', value: '2' },
				'normal': { name: '16px', value: '3' },
				'large': { name: '18px', value: '4' },
				'x-large': { name: '24px', value: '5' },
				'xx-large': { name: '32px', value: '6' },
				'xxx-large': { name: '48px', value: '7' }
			};

			//修改内容的回调
			this.editor.config.onchange = function(newHtml) {
				that.$emit('newHtml', newHtml);
			};
			//修改上传图片
			this.editor.config.customUploadImg = async function(resultFiles, insertImgFn) {
				console.log(resultFiles);
				// that.$emit("customUploadImg",{resultFiles, insertImgFn})
				let oss = null;
				try {
					oss = await that.getOssInfo();
				} catch (e) {
					that.$message.warning('获取oss失败');
					// console.log('获取签名失败')
				}
				// console.log(oss);
				if (oss == false) {
					return that.$message.warning('获取oss签名失败');
				} else {
					that.uploadImg(oss, resultFiles, insertImgFn);
				}
			};
		},
		createEditor(content) {
			this.editor.create();
			this.editor.txt.html(content);
		},
		disable() {
			//禁用编辑器
			this.editor.disable();
		},
		destroyEditor() {
			if(this.editor) {
				this.editor.destroy();
			}
			this.editor = null;
			console.log('销毁编辑器', this.editor);
		},
		clear() {
			//清空内容
			this.editor&&this.editor.txt.clear();
		},
		startEditor() {
			if(this.editor) return;
			this.$nextTick(() => {
				this.initChange();
				this.createEditor(this.content);
				this.getOssInfo();
			});
		},
		async getOssInfo() {
			let params = {
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
		async uploadImg(oss, resultFiles, insertImgFn) {
			if (resultFiles.length <= 0) {
				return this.$message.warning('获取文件失败');
			}
			let list = await this.upload(oss, resultFiles);
			list.map(imgurl => {
				console.log(imgurl);
				insertImgFn(imgurl);
			});
		},
		async upload(oss, files) {
			let list = []; //图片url 数组
			let { accessId, expire, host, dir, policy, signature ,url} = oss;
			console.log(oss)
			let config = {
				header: { 'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime() }
			};
			for (let i = 0; i < files.length; i++) {
				console.log(accessId)
				const { lastModified, lastModifiedDate, name, size, type, webkitRelativePath } = files[i]; //解耦文件对象
				console.log(files[i])
				// const { status, name, size, raw, percentage, uid } = files[i]; //解耦文件对象
				const hash = await this.getMd5Name(files[i]);
				const Extension = this.getExtension(name); //图片后缀名
				const fileName = new Date().getTime() + '_' + hash + Extension;
				// console.log( name, fileName )
				let val = await compress(files[i]);
				// let val = await compress(raw);
				let newfile = new window.File([val], name, { type: type });
				// newfile.uid = uid;
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
				if (res.status == 200 || res.status === 10200 ) {
					list.push(`${url}/${dir}/${fileName}`);
				}
			}
			return list;
		},
		getMd5Name(row) {
			return new Promise(function(resolve, reject) {
				try {
					let fileReader = new FileReader();
					let spark = new SparkMD5.ArrayBuffer();
					//获取文件二进制数据
					fileReader.readAsArrayBuffer(row);
					//异步执行函数
					fileReader.onload = function(e) {
						spark.append(e.target.result);
						let md5 = spark.end();
						//将根据文件生成的hash码丢入数组里，命名文件时再用。
						resolve(md5);
					};
				} catch (e) {
					//TODO handle the exception
					console.log('md5失败!');
					reject(e);
				}
			});
		},
		// 获取 .后缀名
		getExtension(name) {
			return name.substring(name.lastIndexOf('.'));
		}
	}
};
</script>

<style lang="scss" scoped="scoped">
#wang-Editor {
	font[size='1'] {
		font-size: 12px;
	}
	font[size='2'] {
		font-size: 14px;
	}
	font[size='3'] {
		font-size: 16px;
	}
	font[size='4'] {
		font-size: 18px;
	}
	font[size='5'] {
		font-size: 24px;
	}
	font[size='6'] {
		font-size: 32px;
	}
	font[size='7'] {
		font-size: 48px;
	}
}
table {
	border-top: 1px solid #ccc;
	border-left: 1px solid #ccc;
}
table td,
table th {
	border-bottom: 1px solid #ccc;
	border-right: 1px solid #ccc;
	padding: 3px 5px;
}
table th {
	border-bottom: 2px solid #ccc;
	text-align: center;
}

/* blockquote 样式 */
blockquote {
	display: block;
	border-left: 8px solid #d0e5f2;
	padding: 5px 10px;
	margin: 10px 0;
	line-height: 1.4;
	font-size: 100%;
	background-color: #f1f1f1;
}

/* code 样式 */
code {
	display: inline-block;
	*display: inline;
	*zoom: 1;
	background-color: #f1f1f1;
	border-radius: 3px;
	padding: 3px 5px;
	margin: 0 3px;
}
pre code {
	display: block;
}

/* ul ol 样式 */
ul,
ol {
	margin: 10px 0 10px 20px;
}
</style>
