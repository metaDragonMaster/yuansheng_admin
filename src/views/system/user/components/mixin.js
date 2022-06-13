import REGEXP from '@/utils/RegExpUtil.js';

export default {
	//form表单通用方法
	data(){return {
		Rules: {
			mobile: [{ required: true, message: '不能为空', trigger: 'blur' },
			{
				validator: (rule, value, callback) => {
					if (REGEXP.phone(value)) {
						callback(new Error('请输入正确的手机号'));
					} else {
						callback();
					}
				},
				trigger: 'blur'
			}],
			password: [{ required: true, message: '不能为空', trigger: 'blur' }],
			roleIds: [{ required: true, message: '不能为空', trigger: 'blur' }],
			username: [
				{ required: true, message: '不能为空', trigger: 'blur' },
				{
					validator: (rule, value, callback) => {
						if (REGEXP.username(value)) {
							callback(new Error('请输入英文开头，只包含英文、数字或下划线的2-20字符'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}
			]
		},
	}},
};
