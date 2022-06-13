<template>
	<div class="image-card">
		<el-image @mouseenter="controlMask(true)" :style="boxSize" :src="src">
			<div slot="error" class="image-error-slot"
				style="	height: 100%;
						width: 100%;
						background-color: #e1e1e1;"
			>
				<slot name="error"></slot>
			 </div>
		</el-image>
		<transition name="mask">
			<div class="image-card-mask" :style="boxSize" v-show="showMask" @mouseleave="controlMask(false)">
				<slot></slot>
				<!-- <i class="el-icon-edit"></i>
				<i class="el-icon-share"></i>
				<i class="el-icon-delete"></i> -->
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	data() {
		return {
			showMask: false
		};
	},
	props: {
		src: {
			type: String,
			default: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
		},
		height: {
			type: String,
			default: '100%'
		},
		width: {
			type: String,
			default: '100%'
		}
	},
	computed: {
		boxSize() {
			let width = this.width;
			let height = this.height;
			return `width: ${width}; height: ${height}`;
		}
	},
	mounted() {},
	methods: {
		controlMask(control) {
			this.showMask = control;
		},
	}
};
</script>
<style lang="scss" scoped="scoped">
.image-card {
	position: relative;
	display: inline-table;
	margin: 0.5rem;
	.el-image {
		border-radius: 0.25rem;
	}
	.image-card-mask {
		position: absolute;
		left: 0;
		top: 0;
		background-color: rgba(#ffffff, 0.8);
		display: flex;
		justify-content: space-around;
		align-items: center;
		i {
			cursor: pointer;
		}
	}
}
.mask-enter-active,
.mask-leave-active {
	transition: opacity 0.5s;
}
.mask-enter, .mask-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}
.image-error-slot {
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(#000000, 0.8);
}
</style>
