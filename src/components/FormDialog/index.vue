<template>
	<!-- 		:v-el-drag-dialog="drag" -->
	<el-dialog
		class="drag-dialog"
		v-el-drag-dialog="{'drag':drag}"
		v-bind="$attrs"
		:show-close="false"
		center
		:top="top"
		:visible.sync="value"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<slot></slot>
		<slot slot="footer" name="footer"></slot>
	</el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
	data(){return{
		// show:false,
	}},
	directives:{
		elDragDialog,
		// "v-el-drag-dialog":this.drag?elDragDialog:(el, binding, vnode)=>{}
	},
	props:{
		value:{
			required:true,
			type: Boolean
		},
		top: {
			type:String,
			default:"6vh"
		},
		drag:{
			type:Boolean,
			default:true,
		},
	},
	methods:{
		// open() {
		// 	this.show = true;
		// },
		// close() {
		// 	this.show = false;
		// }
	}
}
</script>
<style  lang="scss" scoped="scoped">
// .drag-dialog {
// 	::v-deep .el-form {
// 		padding-right: 2rem;
// 	}
// }
.drag-dialog {
	max-height: 100vh;
}
</style>
