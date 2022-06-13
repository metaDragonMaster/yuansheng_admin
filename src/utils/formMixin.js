export default {
	//form表单通用方法
	methods: {
		// FormUtil() {
		// 	return FormUtil;
		// },
		emptyForm(refNmae) {
			if (!refNmae) {
				console.warn('form mixin:未传输form表单refName')
			}
			let formName = refNmae || 'Form';
			//重置表单
			this.resetForm(formName);
			// this.clearValidate(formName);
			return new Promise(function(res){
				res()
			})
		},
		resetForm(formName, label) {
			//清空表单的验证结果
			this.$nextTick(() => {
				let refNmae = formName || 'Form';
				// console.log(this.$refs[refNmae]);
				if (label) {
					this.$refs[refNmae].resetFields(label);
					return;
				}
				this.$refs[refNmae].resetFields();
			});
		},
		clearValidate(formName, label) {
			//移除该表单项的校验结果
			this.$nextTick(() => {
				let refNmae = formName || 'Form';
				if (label) {
					this.$refs[refNmae].clearValidate(label);
					return;
				}
				this.$refs[refNmae].clearValidate();
			});
		},
		validateForm(refNmae) {
			let formName = refNmae || 'Form';
			let that = this;
			return new Promise(function(resolve, reject) {
				that.$refs[formName].validate(valid => {
					if (valid) {
						resolve()
						return true;
					} else {
						reject()
						return false;
					}
				});
			})
		},
	},
};
