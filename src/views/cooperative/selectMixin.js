export default {
	data() {
		return{
			selectCooperativeLv: [{ value: 0, label: '村级' }, { value: 1, label: '县级' }],
			selectStatus: [
				{
					value: 0,
					label: '待上传图片',
				},
				{
					value: 1,
					label: '待人工审核',
				},
				{
					value: 2,
					label: '审核成功待打款验证',
				},
				{
					value: 3,
					label: '成功',
				},
				{
					value: -1,
					label: '审核失败',
				},
				{
					value: -2,
					label: '打款验证失败',
				},
				{
					value: -3,
					label: '冻结',
				},
			]
			// 0待上传图片 ，1待人工审核，2审核成功待打款验证，3成功，-1审核失败， -2打款验证失败，-3冻结
		}
	},
}
