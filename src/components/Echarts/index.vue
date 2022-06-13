<template>
	<div :class="className" :style="{ height: height, width: width }" />
</template>
<script>
import * as echarts from 'echarts';
export default {
	data() {
		return {
			chart: null
		};
	},
	props: {
		className: {
			type: String,
			default: 'echarts'
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
	mounted () {
		this.startEcharts()
	},
	beforeDestroy() {
		if (!this.chart) {
			return;
		}
		this.chart.dispose();
		this.chart = null;
	},
	methods: {
		startEcharts() {
			this.chart = echarts.init(this.$el, 'macarons');
		},
		setOptions(option) {
			this.chart.setOption(option);
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
