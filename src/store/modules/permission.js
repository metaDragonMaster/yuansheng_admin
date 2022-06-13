import {
	asyncRoutes,
	constantRoutes
} from '@/router'
// import Layout from '@/layout';

export function ImportAsyncRoutes(menuList = []) {
	let routes = [];
	let tmp = [];
	let route = [];
	// console.log(menuList)
	for (let i = 0; i < menuList.length; i++) {
		if (menuList[i].children && menuList[i].children.length > 0) {
			route = changeRoute(menuList[i]);
			route.children = ImportAsyncRoutes(menuList[i].children);
			routes.push(route);
		} else {
			tmp.push(changeRoute(menuList[i]));
		}
	}
	return routes.concat(tmp);
}

export function changeRoute(route) {
	route.component = loadView(route.component);
	return route;
}

function loadView(view) {
	let path = '';
	if (view == 'Layout') {
		// return require('@/layout/index.vue').default;
		path = '@/layout/index.vue';
		// return () => Promise.resolve(require('@/layout/index.vue').default)
	} else {
		path = view.indexOf('/') == 0 ?`@/views${view}`:`@/views/${view}`;
		// return require(path).default;
	}
	return () => Promise.resolve(require(`${path}`).default)
}


const state = {
	routes: [],
	addRoutes: []
}

const mutations = {
	SET_ROUTES: (state, routes) => {
		state.addRoutes = routes
		state.routes = constantRoutes.concat(routes)
	}
}

const actions = {
	generateRoutes({
		commit
	}, data) {
		//在这里做路由过滤
		return new Promise(resolve => {
			let accessedRoutes;
			// console.log(data)
			// accessedRoutes = ImportAsyncRoutes(data) || []
			accessedRoutes = asyncRoutes || []	//本地路由
			// console.log("accessedRoutes",accessedRoutes)
			commit('SET_ROUTES', accessedRoutes)
			resolve(accessedRoutes)
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
