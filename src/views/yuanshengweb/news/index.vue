<template>
	<el-row class="view">
		<el-card class="select">
			<div slot="header" class="flex-align-center">
				<span>系统用户</span>
				<el-button @click="openEditNewsDialog()" type="primary" class="drift-right">添加新闻资讯</el-button>
				<el-button @click="$refs['FormDrawer'].open()" type="primary" class="drift-right">打开查询表单</el-button>
			</div>
			<el-table
				ref="TableDom"
				:data="tableData"
				v-loading="tableLoading"
				show-overflow-tooltip
				tooltip-effect="dark"
				:header-cell-style="{ textAlign: 'center', 'background-color': '#f9f9f9', color: '#333333' }"
				:cell-style="{ textAlign: 'center' }"
			>
				<el-table-column label="标题" prop="newsTitle" min-width="200">
					<template v-slot="{row}">
						<p class="font-hide" :title="row.newsTitle" >{{row.newsTitle}}</p>
					</template>
				</el-table-column>
				<el-table-column label="作者昵称" prop="newsAuthor" min-width="120"></el-table-column>
				<el-table-column label="封面" prop="newsTitleImage" min-width="120">
					<template v-slot="{ row }">
						<el-image style="width: 100px; height: 100px" :src="row.newsTitleImage" :preview-src-list="[row.newsTitleImage]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="资讯内容" prop="newsContent" min-width="120"><template v-slot="{ row }">
					<el-link type="success" @click="$refs['HtmlDialog'].open(row.newsTitle,row.newsContent)">
						<i class="el-icon-view el-icon--right"></i>
						查看内容
					</el-link>
				</template></el-table-column>
				<el-table-column label="创建时间" prop="createTime" min-width="160"></el-table-column>
				<el-table-column label="资讯类型" prop="newsTypeId" min-width="120"
					:formatter="row=>getItemLabel(selectNewsType,row.newsTypeId,'newsTypeId','newsTypeName')"
				></el-table-column>
				<el-table-column label="平台" prop="platformTypeId" min-width="120"
					:formatter="row=>getItemLabel(selectPlatformType,row.platformTypeId,'platformTypeId','platformTypeName')"
				></el-table-column>
				<el-table-column label="是否发布" prop="isRelease" min-width="120"
					:formatter="row=>row.isRelease?'是':'否'"
				></el-table-column>
				<el-table-column label="操作" min-width="180" :fixed="tableData.length > 0 ? 'right' : false">
					<template v-slot="{ row }">
						<el-link type="primary" @click="openEditNewsDialog(row)" icon="el-icon-edit">修改资讯</el-link>
						<el-link type="danger" @click="deleteRow(row.newsId)" icon="el-icon-delete">删除</el-link>
					</template>
				</el-table-column>
				<el-empty description="暂无数据" slot="empty"><el-button type="primary" @click="startGetTableData()">尝试获取</el-button></el-empty>
			</el-table>
			<TablePagination
				:total="tableQueryOption.total"
				:current="tableQueryOption.current"
				@currentChange="
					val => {
						tableQueryOption.current = val;
						getTableData();
					}
				"
				@sizeChange="
					val => {
						tableQueryOption.size = val;
						getTableData();
					}
				"
			/>
		</el-card>
		<HtmlDialog ref="HtmlDialog"></HtmlDialog>
		<EditNewsDialog ref="EditNewsDialog" @success="startGetTableData" :selectNewsType="selectNewsType" :selectPlatformType="selectPlatformType"></EditNewsDialog>
		<FormDrawer ref="FormDrawer" size="400px" title="查询表单" @submit="submit" @success="startGetTableData" @closed="emptyForm">
			<el-form ref="Form" :model="Form" :rules="Rules" label-position="right" label-width="120px">
				<el-form-item prop="newsTitle" label="标题"><el-input v-model="Form.newsTitle" /></el-form-item>
				<el-form-item prop="newsTypeId" label="新闻资讯类型">
					<el-select v-model="Form.newsTypeId"><el-option v-for="item in selectNewsType" :key="item.newsTypeId" :value="item.newsTypeId" :label="item.newsTypeName"></el-option></el-select>
				</el-form-item>
				<el-form-item prop="platformTypeId" label="平台类型">
					<el-select v-model="Form.platformTypeId"><el-option v-for="item in selectPlatformType" :key="item.platformTypeId"  :value="item.platformTypeId" :label="item.platformTypeName"></el-option></el-select>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button type="warning" @click="emptyForm('Form')">重置</el-button>
			</template>
		</FormDrawer>
	</el-row>
</template>

<script>
import Api from '@/api/yuanshengweb/news.js';

import FormUtil from '@/utils/formUtil.js';
import $_Confirm from '@/utils/confirm.js';

import FormDrawer from '@/components/FormDrawer/index.vue';
import TablePagination from '@/components/TablePagination/index.vue';
import HtmlDialog from "./modules/htmlDialog.vue";
import EditNewsDialog from "./components/EditNewsDialog.vue";

export default {
	data() {
		return {
			FormUtil: FormUtil,
			tableLoading: false,
			tableData: [],
			tableQueryOption: {
				size: 10,
				current: 1,
				total: 0
			},
			Form: {
				newsTitle: '', //	标题（模糊搜索）	query	false	string
				newsTypeId: '', //	新闻资讯类型ID	query	false	integer(int32)
				platformTypeId: '' //	平台类型ID	query	false	integer(int32)
			},
			Rules: {
				// username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
			},
			selectNewsType: [],
			selectPlatformType: []
		};
	},
	components: {
		FormDrawer,
		TablePagination,
		HtmlDialog,
		EditNewsDialog,
	},
	mounted() {
		this.init();
	},
	methods: {
		getItemLabel:FormUtil.getItemLabel,
		startGetTableData() {
			this.tableQueryOption.current = 1;
			this.getTableData();
		},
		init() {
			this.getTableData();
			this.getNewsTypeList();
			this.getPlatformTypeList();
		},
		submit() {
			this.validateForm('Form').then(res => {
				this.$refs['FormDrawer'].closeDrawer();
			});
		},
		async getNewsTypeList() {
			let {data} = await Api.getNewsTypeList();
			this.selectNewsType = data;
		},
		async getPlatformTypeList() {
			let {data} = await Api.getPlatformTypeList();
			this.selectPlatformType = data;
		},
		async fliterFrom() {
			let form = await FormUtil.filterHasValue(this.Form);
			let options = await FormUtil.excludeAttr(this.tableQueryOption, 'total');
			let params = {
				...form,
				...options
			};
			return params;
		},
		async getTableData() {
			console.log("query")
			this.tableLoading = true;
			let params = await this.fliterFrom();
			// console.log(params);
			let { code, data, msg } = await Api.selectNewsList(params).finally(() => {
				this.tableLoading = false;
			});
			if (code == 10200) {
				this.tableData = data.records;
				this.tableQueryOption.total = data.total;
			}
		},
		openEditNewsDialog(row) {
			this.$refs['EditNewsDialog'].open(row)
		},
		async deleteRow(ids) {
			console.log(ids)
			$_Confirm({
				title: '删除操作',
				content: '是否确认删除',
				thenFunc: async () => {
					let { code, data, msg } = await Api.deleteNewsInfoById(ids);
					if (code == 10200) {
						this.startGetTableData();
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped="scoped"></style>
