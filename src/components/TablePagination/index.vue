<template>
	<div class="table-pagination">
		<slot></slot>
		<el-pagination
			:layout="layout"
			:total="total"
			:page-size="size"
			:page-sizes="sizes"
			:current-page="current"
			@current-change="currentChange"
			@size-change="sizeChange"
		></el-pagination>
	</div>
</template>
<script>
export default {
	data() {return {
	}},
	props:{
      pages:{
          type:Number,
          default:0
      },
		total :{
			type:Number,
			default:0
		},
		current :{
			type:Number,
			default:1
		},
		size:{
			type:Number,
			default:10
		},
		sizes: {
			type:Array,
			default:()=>[10]
		},
		layout: {
			type:String,
			default:"total, sizes, prev, pager, next, jumper"
		}
	},
	methods:{
		currentChange(val) {
			this.$emit("currentChange",val);
		},
		sizeChange(val) {
			this.$emit("sizeChange",val);
		}
	}
}
</script>
<style  lang="scss" scoped="scoped">
.table-pagination {
	display: flex;
	align-items: center;
	margin-top: 1rem;
}
.el-pagination {
	width: fit-content;
	margin: 0 1rem 0 auto ;
}
</style>
