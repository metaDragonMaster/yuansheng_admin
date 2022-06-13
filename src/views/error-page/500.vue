<template>
	<div>
		<img src="@/assets/500_images/500.jpg" alt="">
		<el-button @click="back">返回</el-button>
	</div>
</template>
<script>
export default {
	methods:{
		back(){
			this.$router.push({ path: this.$route.redirect||"/" });
		}
	}
}
</script>
<style  lang="scss" scoped="scoped">
img {
	width: 760px;
	margin: 0 auto;
	display: block;
}
.el-button {
	width: fit-content;
	margin: 0 auto;
	display: block;
}
</style>
