<template>
	<!-- :destroy-on-close="true" -->
	<el-drawer
		append-to-body
		ref="DrawerDom"
		class="form-drawer"
		:title="title"
		:visible.sync="show"
		:size="size"
		:show-close="false"
		:wrapperClosable="false"
		:close-on-press-escape="false"
		:before-close="handleClose"
		:modal="modal"
		@closed="$emit('closed')"
	>
		<slot></slot>
		<div class="drawer__footer">
			<el-button type="primary" @click="submit" :loading="loading">{{ loading ? '请稍等...' : '确 定' }}</el-button>
			<el-button @click="close" :disabled="loading == true">取 消</el-button>
			<slot name="footer"></slot>
		</div>
	</el-drawer>
</template>
<script>
/**
 * 封装抽屉，减少操作。
 * @data
 * show         控制抽屉展示
 * loading      控制等待状态
 * timer        等待时间对象
 * @props
 * size         抽屉大小  默认600px
 * title        抽屉标题
 * direction    抽屉位置
 * @methods
 * open         外部打开抽屉    $refs['FormDrawer'].open()
 * submit       点击确认按钮后，外部等待验证,没办法了,这个组件获取不到slot的ref
 *  *  外部 submit() {
 *  *    this.validateForm('Form').then(res=>{
 *  *      this.$refs['FormDrawer'].closeDrawer();
 *  *    });
 *  *  },
 * close        点击取消按钮，并提交一个closed的函数
 * handleClose  关闭前的提示框，是否执行最后的submit提交就得点确认。
 * */

/*
 <FormDrawer ref="FormDrawer" title="查询表单" @submit="submit" @success="getTableData" @closed="emptyForm">
      <el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
        <el-form-item prop="name" label="label"><el-input v-model="Form.name" /></el-form-item>
      </el-form>
    </FormDrawer>
 */
export default {
	data() {
		return {
			show: false,
			loading: false,
			timer: null
		};
	},
	props: {
		size: {
			type: String,
			default: '600px'
		},
		title: {
			type: String,
			default: ''
		},
		modal: {
			type: Boolean,
			default: true
		},
		direction: {
			type: String,
			default: 'rtl',
			validator(value) {
				return ['rtl', 'ltr', 'ttb', 'btt'].includes(value);
			}
		}
	},
	deactivated() {
		clearTimeout(this.timer);
	},
	methods: {
		open() {
			this.show = true;
		},
		handleClose(done) {
			if (this.loading !== false) {
				return;
			}
			// console.log('$confirm start');
			this.$confirm('确定要提交表单吗？')
				.then(async _ => {
					this.loading = true;
					this.$emit('success');
					this.timer = setTimeout(() => {
						done();
						// this.$emit('closed');
						// 动画关闭需要一定的时间
						setTimeout(() => {
							this.loading = false;
						}, 400);
					}, 1000);
				})
				.catch(_ => {
					// this.close();
				});
		},
		close() {
			this.loading = false;
			this.show = false;
			clearTimeout(this.timer);
			// this.$emit('closed');
		},
		closeDrawer() {
			this.$refs['DrawerDom'].closeDrawer();
		},
		submit() {
			this.$emit('submit');
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
.drawer__footer {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 1rem;
	padding: 1rem;
	::v-deep .el-button {
		margin-left: 0;
	}
}
.form-drawer {
	::v-deep.el-form {
		padding-right: 1rem;
		padding-left: 1rem;
	}
}
</style>
