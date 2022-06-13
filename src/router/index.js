import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Router
// 解决相同路径跳转报错
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
	// if (onResolve || onReject) {
	return routerPush.call(this, location, onResolve, onReject)
	// }
	// return routerPush.call(this, location).catch(error => error)
}

/* Layout */
import Layout from '@/layout'
import AppMain from '@/layout/components/AppMain.vue'
import ChildrenView from '@/layout/components/ChildrenView.vue'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
		path: '/redirect',
		component: Layout,
		hidden: true,
		children: [{
			path: '/redirect/:path(.*)',
			component: () => import('@/views/redirect/index')
		}]
	},
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true,
		meta: {
			notKeepAlive: true
		}
	},
	{
		path: '/404',
		component: () => import('@/views/error-page/404'),
		hidden: true
	},
	{
		path: '/401',
		component: () => import('@/views/error-page/401'),
		hidden: true
	},
	{
		path: '/500',
		component: () => import('@/views/error-page/500'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		children: [{
			path: 'dashboard',
			component: () => import('@/views/dashboard/index'),
			name: 'Dashboard',
			meta: {
				title: 'Dashboard',
				icon: 'dashboard',
				affix: true,
				notKeepAlive: true
			}
		}]
	},
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
		path: '/demo',
		component: Layout,
		redirect: '/dashboard',
		meta: {
			title: 'demo',
			icon: 'dashboard',
			notKeepAlive: true
		},
		children: [{
			path: '/demo/index',
			component: () => import('@/views/demo/index.vue'),
			name: 'demo',
			meta: {
				title: 'demoIndex',
				icon: 'tree',
				notKeepAlive: true
			}
		}, ]
	},
	{
		path: '/system',
		component: Layout,
		redirect: '/dashboard',
		meta: {
			title: '系统',
			icon: 'list',
		},
		children: [{
				path: '/system/loginLog',
				component: () => import('@/views/system/loginLog/index.vue'),
				name: 'loginLog',
				meta: {
					title: '登录日志',
					icon: 'table',
				}
			},
			{
				path: '/system/role',
				component: () => import('@/views/system/role/index.vue'),
				name: 'role',
				meta: {
					title: '系统角色',
					icon: 'table',
				}
			},
			{
				path: '/system/systemLog',
				component: () => import('@/views/system/systemLog/index.vue'),
				name: 'systemLog',
				meta: {
					title: '系统日志',
					icon: 'table',
				}
			},
			{
				path: '/system/menu',
				component: () => import('@/views/system/menu/index.vue'),
				name: 'menu',
				meta: {
					title: '系统菜单',
					icon: 'table',
				}
			},
			{
				path: '/system/user',
				component: () => import('@/views/system/user/index.vue'),
				name: 'user',
				meta: {
					title: '系统用户',
					icon: 'table',
				}
			},

		]
	},
	{
		path: '/cooperative',
		component: Layout,
		redirect: '/dashboard',
		children: [
			{
				path: '/cooperative/Manage',
				component: () => import('@/views/cooperative/index.vue'),
				name: 'nzjcCooperativeManage',
				meta: {
					title: '合作企业管理',
					icon: 'table',
				}
			},
		]
	},
	{
		path: '/nzjc',
		component: Layout,
		redirect: '/dashboard',
		meta: {
			title: '农资集采',
			icon: 'list',
		},
		children: [
			{
				path: '/nzjc/goodsAuditManage',
				component: () => import('@/views/nzjc/goodsAuditManage/index.vue'),
				name: 'goodsAuditManage',
				meta: {
					title: '商品审核',
					icon: 'table',
				}
			},
			{
				path: '/nzjc/goods',
				name: 'goods',
				redirect: '/dashboard',
				component: ChildrenView,
				meta: {
					title: '商品管理',
					icon: 'table',
				},
				children:[
					{
						path: '/nzjc/goods/supply',
						component: () => import('@/views/nzjc/goodsSupply/index.vue'),
						name: 'goodsSupply',
						meta: {
							title: '供货商品',
							icon: 'table',
						}
					},
					{
						path: '/nzjc/goods/purchase',
						component: () => import('@/views/nzjc/goodsPurchase/index.vue'),
						name: 'goodsPurchase',
						meta: {
							title: '采购商品',
							icon: 'table',
						}
					},
				]
			},
			{
				path: '/nzjc/propagate',
				component: () => import('@/views/nzjc/propagate/index.vue'),
				name: 'propagate',
				meta: {
					title: '品牌馆宣传图',
					icon: 'table',
				}
			},
			{
				path: '/nzjc/shop',
				component: () => import('@/views/nzjc/shop/index.vue'),
				name: 'shop',
				meta: {
					title: '品牌馆店铺',
					icon: 'table',
				}
			},
		]
	},
	{
		path: '/ncq',
		component: Layout,
		redirect: '/dashboard',
		meta: {
			title: '农超企',
			icon: 'list',
		},
		children: [
			{
				path: '/ncq/propagate',
				component: () => import('@/views/ncq/propagate/index.vue'),
				name: 'propagate',
				meta: {
					title: '品牌馆宣传图',
					icon: 'table',
				}
			},
			{
				path: '/ncq/shop',
				component: () => import('@/views/ncq/shop/index.vue'),
				name: 'shop',
				meta: {
					title: '品牌馆店铺',
					icon: 'table',
				}
			},
		]
	},
	{
		path: '/yuanshengweb',
		component: Layout,
		redirect: '/dashboard',
		meta: {
			title: '原生农业',
			icon: 'list',
		},
		children: [
			{
				path: '/yuanshengweb/news/Manage',
				component: () => import('@/views/yuanshengweb/news/index.vue'),
				name: 'yuanshengwebNewsManage',
				meta: {
					title: '平台资讯',
					icon: 'table',
				}
			},
		]
	},
	// 404 page must be placed at the end !!!
	{
		path: '*',
		name: "error",
		redirect: '/404',
		hidden: true
	}
]

const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRoutes,
	isAdded: false, //判断是否已经添加了路由。 登出的时候要把它改false，不然无法再次添加路由了。
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
