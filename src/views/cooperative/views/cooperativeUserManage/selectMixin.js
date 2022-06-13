import { mapActions, mapGetters } from 'vuex';
export default {
	data() {
		return{
			selectAdminLv: [{ value: 0, label: '普通成员' }, { value: 1, label: '一级管理员' }, { value: 2, label: '二级管理员' }],
			selectHealth: [{ value: 0, label: '健康' }, { value: 1, label: '一般' }, { value: 2, label: '欠佳' }],
			selectPoliticalStatus: [{ value: 0, label: '群众' }, { value: 1, label: '党员' }],
			selectSex: [{ value: '0', label: '男' }, { value: '1', label: '女' }, { value: '2', label: '保密' }],
			selectStatus: [
				{ value: 0, label: '待审核' },
				{ value: 1, label: '已经提交人工审核' },
				{ value: 2, label: '审核成功' },
				{ value: 3, label: '失败' },
				{ value: -1, label: '冻结' }
			],
		}
	},
	computed:{
		...mapGetters(['cooperativeInfo']),
	},
}
