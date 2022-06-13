<template>
	<el-dialog title="内容" :visible.sync="show" width="980px" >
		<!-- <el-image :src="ContentDialogImage" fit="contain" class="mini-image" v-show="ContentDialogImage!=''">
			<div slot="placeholder" class="image-slot">
				加载中
				<span class="dot">...</span>
			</div>
		</el-image> -->
		<h3>标题：{{title}}</h3>
		<div class="ql-editor ContentDialogHtmlClass" v-html="html"></div>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			show:false,
			title:"",
			html:"",
		}
	},
	methods: {
		open(title,html) {
			this.show = true;
			this.title = title;
			this.html = html;
		},
		close() {
			this.show = false;
		}
	}
}
</script>

<style>
</style>
