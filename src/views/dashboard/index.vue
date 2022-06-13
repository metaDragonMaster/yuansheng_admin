<template>
	<div class="dashboard-container">
		<!-- <imageCard height="100px" width="100px">
			
		</imageCard>
		<p>{{image}}</p>
		<uploadImg
			moduleName="culture"
			:maxSize="5"
			immediately
			@imageUrls="getImageUrls"
		></uploadImg> -->
	</div>
</template>

<script>
// import imageCard from "@/components/ImageCard/index.vue"
// import uploadImg from '@/components/UploadImg/index.vue';
export default {
	name: 'Dashboard',
	data() {
		return {
			// image:""
		};
	},
	components:{
		// imageCard,
		// uploadImg,
	},
	mounted() {
	},
	methods: {
		// getImageUrls(urls) {
		// 	console.log(urls)
		// 	this.image = urls[0];
		// }
	}
};
</script>
