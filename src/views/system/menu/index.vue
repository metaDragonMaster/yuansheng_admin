<template>
	<el-row class="view" :gutter="10">
		<el-col :xs="col.xs" :sm="col.sm" :md="col.md" :lg="col.lg" :xl="col.xl">
			<el-card class="menuTree">
			<!-- 	<div class="sys-menu-treeOperation">
					<el-input v-model="searchValue" clearable placeholder="搜索路由" />
					<el-button :type="searchButtonTypeRules" :disabled="searchButtonTypeRules !== 'primary'">搜索</el-button>
				</div> -->
				<el-tree :data="menuTree" accordion node-key="id" ref="tree"  :props="menuTreeProps">
					<!--  highlight-current @node-click="nodeClick" -->
					<div class="custom-tree-node" slot-scope="{ node, data }">
						<p>{{ node.label }}</p>
						<p class="drift-right">
							<el-button type="text" size="mini" @click.stop="nodeClick(data)">选中该菜单</el-button>
							<el-button type="text" size="mini" @click.stop="menuToLayout(data.mid)">选为上级菜单</el-button>
							<el-button type="text" size="mini" @click.stop="deleteMenu(data.mid)">删除该路由</el-button>
						</p>
					</div>
					<!-- <div slot-scope="{node,data}">
						{{data}}
					</div> -->
				<!-- 	<template v-slot="row">
						<div>{{row}}</div>
					</template> -->
				</el-tree>
			</el-card>
		</el-col>
		<el-col :xs="col.xs" :sm="col.sm" :md="col.md" :lg="col.lg" :xl="col.xl">
			<el-card class="operation">
				<div slot="header" class="operation-header">
					<span>{{ operationTypeTitle }}</span>
				</div>
				<!-- {{menuForm}} -->
				<el-form ref="menuForm" :model="menuForm" :rules="operationIsButton ? menuRules : menuBtnRules" label-position="right" label-width="120px">
					<el-form-item label="上级菜单" prop="parentId">
						<div style="display: flex;">
							<tree-select
								ref="selectPid"
								:data="menuFilterTree"
								:defaultProps="menuTreeProps"
								:nodeKey="nodeKey"
								:checkedKeys="defaultCheckedKeys"
								@popoverHide="popoverHide"
							></tree-select>
							<el-button style="margin-left: 1rem;" @click="menuToLayout(0)">顶级菜单</el-button>
						</div>
					</el-form-item>
					<el-form-item label="路由标题" prop="menuName"><el-input v-model="menuForm.menuName" placeholder="例:首页" /></el-form-item>
					<!-- <el-form-item label="路由名称" prop="name"><el-input v-model="menuForm.name" placeholder="例:index" /></el-form-item> -->
					<el-form-item label="前端组件路径" v-show="operationIsButton" prop="component"><el-input v-model="menuForm.component" placeholder="例:/index" /></el-form-item>
					<el-form-item label="前端路由" v-show="operationIsButton" prop="path"><el-input v-model="menuForm.path" placeholder="例:/" /></el-form-item>
					<el-form-item label="组件类型" prop="type">
						<el-radio-group v-model="menuForm.type" :disabled="haveCurrentRow">
							<el-radio :label="0">菜单</el-radio>
							<el-radio :label="1">按钮</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="路由重定义" v-show="operationIsButton" prop="redirect"><el-input v-model="menuForm.redirect" placeholder="例:/dashboard" /></el-form-item>
					<el-form-item label="菜单描述" v-show="operationIsButton" prop="description"><el-input v-model="menuForm.description" placeholder="例:仪表盘" /></el-form-item>
					<el-form-item label="图标" v-show="operationIsButton" prop="icon"><el-input v-model="menuForm.icon" placeholder="例:dashboard" /></el-form-item>
					<el-form-item label="菜单顺序" prop="sort">
						<el-input-number v-model="menuForm.sort" :min="0" :max="100000" label="描述文字"></el-input-number>
					</el-form-item>
					<el-form-item label="权限" prop="perms"><el-input v-model="menuForm.perms" placeholder="例:sysUser:list" /></el-form-item>
					<el-form-item>
						<el-button type="plain" @click="resetOperation">重置</el-button>
						<el-button type="primary" @click="submit">提交</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-col>
	</el-row>
</template>
<script>
import ApiMenu from '@/api/system/menu.js';
import FormUtil from '@/utils/formUtil.js';
import REGEXP from '@/utils/RegExpUtil.js';
import TreeSelect from '@/components/TreeSelect/index.vue';
import $_Confirm from '@/utils/confirm.js';
export default {
	data() {
		return {
			col: {
				xs: 24,
				sm: 24,
				md: 24,
				lg: 12,
				xl: 12
			},
			currentRow: null,
			// operationType: 0, //操作类型 0 新增 1 修改
			// operationTreeDom: {}, //操作菜单树节点对象
			menuMid: null,
			menuForm: {
				menuName: '', // *	string 标题名
				// name: '', // *	string 名称
				component: '', // * string  前端组件路径
				path: '', // *	string 前端路由
				parentId: null, //*	integer($int32) 父级菜单id
				type: 0, // *	integer($int32) 类型(0-菜单 1-按钮)
				redirect: '', //	string 重定向(默认跳转路径)
				description: '', // string 菜单描述
				icon: '', //	string 图标
				sort: 100000, //	integer($int32) 菜单顺序
				perms: '' //	string 权限
			},
			menuRules: {
				menuName: [{ required: true, message: '请输入路由标题', trigger: 'blur' }],
				// name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
				component: [{ required: true, message: '请输入前端组件路径', trigger: 'blur' }],
				path: [{ required: true, message: '请输入前端组件路径', trigger: 'blur' }],
				parentId: [{ required: true, message: '请输入父级菜单id', trigger: 'blur' }],
				type: [{ required: true, message: '请选择类型', trigger: 'change' }]
			},
			menuBtnRules: {
				menuName: [{ required: true, message: '请输入路由标题', trigger: 'blur' }],
				// name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
				parentId: [{ required: true, message: '请输入父级菜单id', trigger: 'blur' }],
				type: [{ required: true, message: '请选择类型', trigger: 'change' }]
			},
			searchValue: '', //搜索路由
			menuTree: [], //路由树
			menuFilterTree: [], //过滤了按钮的路由树
			menuTreeProps: {
				//路由树配置
				children: 'children',
				label: 'menuName'
			},
			nodeKey: 'mid', //选择路由树的key
			defaultCheckedKeys: [] //默认上级菜单路由树的key
		};
	},
	components: {
		TreeSelect
	},
	computed: {
		searchButtonTypeRules() {
			//验证搜索是否为中文，给出相应的搜索按钮的类型
			let searchValue = this.searchValue;
			let isChinses = REGEXP.only.chinses(searchValue);
			let haveValue = searchValue.length > 0;
			if (!!haveValue && !!isChinses) {
				return 'danger';
			}
			return haveValue ? 'primary' : '';
		},
		haveCurrentRow() {
			return !!this.currentRow;
		},
		operationTypeTitle() {
			// let type = ['新增菜单', '修改菜单'];
			// return type[this.operationType];
			return !this.haveCurrentRow ? '新增菜单' : '修改菜单';
		},
		// operationIsUpdate() {
		// 	return this.operationType !== 0;
		// },
		operationIsButton() {
			return this.menuForm.type === 0;
		}
	},
	watch: {
		'menuForm.type'(n, o) {
			this.clearValidate('menuForm');
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.getMenuTree();
		},
		popoverHide(checkedIds, checkedData) {
			//下拉树级菜单的选择
			// console.log('checkedData',checkedData)
			this.menuForm.parentId = checkedData.mid;
		},
		menuToLayout(parentId) {
			//设置为根级菜单
			// this.$refs['selectPid'].empty();
			console.log(parentId)
			this.resetOperation();
			this.$refs.tree.setCurrentKey();
			this.menuForm.parentId = parentId;
			this.defaultCheckedKeys = [parentId];
		},
		resetOperation() {
			// 重置操作
			this.currentRow = null;
			this.defaultCheckedKeys = [];
			// this.operationType = 0;
			this.resetForm();
			this.clearValidate('menuForm');
		},
		// resetForm(formName) {//清空表单的验证结果
		// 	this.$refs[formName].resetFields();
		// },
		resetForm() {
			this.menuMid = null;
			// this.menuForm = {
			// 	menuName: '', // *	string 标题名
			// 	// menuName: '', // *	string 名称
			// 	component: '', // * string  前端组件路径
			// 	path: '', // *	string 前端路由
			// 	parentId: null, //*	integer($int32) 父级菜单id
			// 	type: 0, // *	integer($int32) 类型(0-菜单 1-按钮)
			// 	redirect: '', //	string 重定向(默认跳转路径)
			// 	description: '', // string 菜单描述
			// 	icon: '', //	string 图标
			// 	sort: 100000, //	integer($int32) 菜单顺序
			// 	perms: '' //	string 权限
			// };
			// this.emptyForm("menuForm");
			this.$refs["menuForm"].resetFields();
			this.$refs["menuForm"].clearValidate();
		},
		clearValidate(formName) {
			//移除该表单项的校验结果
			this.$nextTick(() => {
				this.$refs[formName].clearValidate();
			});
		},
		filterMenuTree(menus) {
			let tree = [];
			menus.forEach(menu => {
				if (menu.children) {
					menu.children = this.filterMenuTree(menu.children);
				}
				if (menu.type === 0) {
					tree.push(menu);
				}
			});
			return tree;
		},
		nodeClick(data) {
			//左边的菜单树节点被点击的事件
			// console.log(data)
			this.clearValidate('menuForm');
			this.currentRow = data;
			this.defaultCheckedKeys = [data.parentId];
			this.menuMid = data.mid;
			this.menuForm.parentId = data.parentId;
			this.menuForm.menuName = data.menuName;
			this.menuForm.component = data.component;
			this.menuForm.path = data.path;
			this.menuForm.type = data.type;
			this.menuForm.redirect = data.redirect;
			this.menuForm.description = data.description;
			this.menuForm.icon = data.icon;
			this.menuForm.sort = data.sort;
			this.menuForm.perms = data.perms;
		},
		submit() {
			this.$refs['menuForm'].validate(async valid => {
				if (valid) {
					let code = 0;
					!this.haveCurrentRow ? (code = await this.addMenu()) : (code = await this.updateMenu());
					if (code === 10200) {
						this.resetOperation();
						this.getMenuTree();
					}
				} else {
					return false;
				}
			});
			// this.resetOperation();
		},
		// 查询菜单树
		async getMenuTree() {
			let {data} = await ApiMenu.selectMenuList();
			// 防止过滤后变量污染
			console.log(data);
			let jsonTreeData = JSON.stringify(data);
			let tree = JSON.parse(jsonTreeData);
			this.menuTree = data;
			this.menuFilterTree = this.filterMenuTree(tree);
		},
		// 新增菜单
		async addMenu() {
			let { code, msg } = await ApiMenu.addMenu(this.menuForm);
			if (code === 10200) {
				this.$notify({
					message: msg,
					type: 'success'
				});
			}
			return code;
		},
		// 删除菜单
		async deleteMenu(mid) {
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, msg } = await ApiMenu.deleteMenuByIds(mid);
					if (code === 10200) {
						this.resetOperation();
						this.getMenuTree();
						this.$notify({
							message: msg,
							type: 'success'
						});
					}
				}
			});
			
			// return code;
		},
		// 修改菜单
		async updateMenu() {
			if (!!!this.menuMid) {
				return this.$message.error('没有选中菜单');
			}
			let { code, msg } = await ApiMenu.updateMenuById(this.menuMid, this.menuForm);
			if (code === 10200) {
				this.resetOperation();
				this.getMenuTree();
				this.$notify({
					message: msg,
					type: 'success'
				});
			}
		}
	}
};
</script>
<style lang="scss" scoped="scoped">
.el-col {
	margin-bottom: 1rem;
}
.operation {
	.operation-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.operation-button {
		// display: block;
		// width: fit-content;
		// margin: 0 0 0 auto;
	}
}
.sys-menu-treeOperation {
	.el-input {
		max-width: 260px;
	}
	& > .el-input,
	& > .el-button,
	& > .el-dropdown {
		margin-left: 10px;
	}
}

.custom-tree-node {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 12px;
	&:hover .drift-right{
		opacity: 1;
	}
	.drift-right {
		opacity: 0.2;
	}
}
</style>
