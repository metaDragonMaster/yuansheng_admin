<template>
	<el-dialog :title="dialogTitle" :visible.sync="show" top="16vh" width="460px" :close-on-click-modal="false" append-to-body @closed="close">
		<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
			<el-form-item prop="result" label="是否通过">
				<el-radio-group v-model="Form.result">
					<el-radio-button :label="true">通过</el-radio-button>
					<el-radio-button :label="false">不通过</el-radio-button>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<div drift-right>
			<el-button class="submit-button " type="success" @click="submit">提交</el-button>
			<el-button @click="show = false">返回</el-button>
		</div>
	</el-dialog>
</template>
<script>
import Api from '@/api/nzjc/ghGoods.js';
import FormUtil from '@/utils/formUtil.js';

export default {
	data() {
		return {
			id: '',
			show: false,
			Form: {
				result: ''
			},
			Rules: {
				result: [{ required: true, message: '请选择', trigger: 'blur' }]
			},
			dialogTitle: ''
		};
	},
	components: {
		// WangEditor,
		// UploadImg
	},
	computed: {},
	mounted() {},
	methods: {
		submit() {
			this.$refs['Form'].validate(async valid => {
				if (valid) {
					let params = {
						...this.Form
					};
					let { code, data, msg } = await Api.setAuditGoodById(this.id, params);
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
		async open(row) {
			console.log(row);
			this.show = true;
			this.id = row.cgGoodsId;
			this.dialogTitle = `审核商品:${row.goodsName}`;
		},
		close() {
			this.$nextTick(() => {
				this.id = '';
			});
			this.emptyForm();
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
