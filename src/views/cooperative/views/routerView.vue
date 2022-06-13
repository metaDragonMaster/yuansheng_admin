<template>
	<el-dialog
		class="type-dialog"
		v-bind="$attrs"
		:show-close="true"
		@close="close"
		center
		top="0"
		:visible.sync="show"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:fullscreen="true"
	>
		<template #title>
			<span>合作社名称:{{cooperativeName}}</span>
		</template>
		<el-radio-group class="drift-right radio-buttons" v-model="componentType" @change="changeType"><el-radio-button v-for="item in types" :key="item.value" :value="item.value" :label="item.value">{{item.label}}</el-radio-button></el-radio-group>
		<component :is="componentType" ref="component" ></component>
	</el-dialog>
</template>
<script>
import cooperativeFarmerManage from './cooperativeFarmerManage/index.vue';
import cooperativeUserManage from './cooperativeUserManage/index.vue';
import { mapActions,mapGetters } from "vuex";
export default {
	data() {
		return {
			// row:null,
			show:false,
			// componentType: 'cooperativeUserManage',
			componentType: 'cooperativeFarmerManage',
			// componentType: '',
			types: [
				{
					value: 'cooperativeUserManage',
					label: '成员管理'
				},
				{
					value: 'cooperativeFarmerManage',
					label: '农户管理'
				}
			]
		};
	},
	components: {
		cooperativeFarmerManage,
		cooperativeUserManage
	},
	computed:{
		...mapGetters(['cooperativeInfo']),
		cooperativeName() {
			let row = this.cooperativeInfo;
			let name = row? row.name : "";
			return name;
			// return "name";
		}
	},
	mounted() {
		// console.log(this.$store)
	},
	methods:{
		...mapActions({ setCooperativeInfo: 'cooperative/setCooperativeInfo' }),
		open(row) {
			this.setCooperativeInfo(row);
			this.show = true;
			this.$nextTick(()=>{
				this.changeType();
			})
		},
		changeType() {
			this.$refs['component'].init();
		},
		close() {
			this.row = null;
			this.setCooperativeInfo(undefined);
			this.componentType = this.types[0].value;
		},

	}
};
</script>
<style lang="scss" scoped="scoped">
.radio-buttons {
	margin-bottom: 1rem;
}
</style>
