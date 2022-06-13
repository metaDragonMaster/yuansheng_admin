import ApiAdminUser from '@/api/admin/user.js';
import {
	getToken,
	setToken,
	removeToken
} from '@/utils/auth'
import router, {
	resetRouter
} from '@/router'

const state = {
	token: getToken(),
	// buttons: [],
	name: '',
	avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
	roles: [],
	routerList: [],
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_BUTTONS: (state, array) => {
		state.buttons = array
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles
	},
	SET_ROUTER_LIST: (state, list) => {
		state.routerList = list
	},
	// SELECT_BUTTONS: (state, value) => {
	//   return state.buttons.includes(value)
	// },
}

const actions = {
	// selectButtons({
	//   commit
	// }, value) {
	//   return state.buttons.includes(value)
	// },

	async login({
		commit
	}, userInfo) {
		let res = await ApiAdminUser.login(userInfo);
		let token = res.data.token_type + ' ' + res.data.access_token;
		commit('SET_TOKEN', token);
		setToken(token, res.data.expires_in);
		return res
	},

	// get user info
	async getInfo({
		commit,
		state
	}) {
		// let token = await getToken();
		let {
			code,
			data,
			msg
		} = await ApiAdminUser.getInfo();
		// console.log("ApiUser getInfo",data)
		return new Promise((resolve, reject) => {
			// commit('SET_ROLES', data.roleList) //权限列表
			commit('SET_NAME', data.username) //用户名
			// commit('SET_BUTTONS', data.buttons) //接口权限列表
			// commit('SET_AVATAR', data.avatar)
			resolve({
				data
			})
		});
	},

	// user logout
	logout({
		commit,
		state,
		dispatch
	}) {
		return new Promise((resolve, reject) => {
			commit('SET_TOKEN', '')
			commit('SET_ROLES', [])
			// commit('SET_ROUTER_LIST', [])
			// localStorage.setItem('routerList',[])
			router.isAdded = false;
			removeToken()
			resetRouter()
			dispatch('tagsView/delAllViews', null, {
				root: true
			})
			resolve()
		})
	},

	// remove token
	resetToken({
		commit
	}) {
		return new Promise(resolve => {
			commit('SET_TOKEN', '')
			commit('SET_ROLES', [])
			// commit('SET_ROUTER_LIST', [])
			// localStorage.setItem('routerList',[])
			removeToken()
			resolve()
		})
	},

	// 改变权限
	async changeRoles({
		commit,
		dispatch
	}, role) {
		const {
			roles
		} = await dispatch('getInfo')
		resetRouter(); //清空路由
		const accessRoutes = await dispatch('permission/generateRoutes', roles, {
			root: true
		})
		router.addRoutes(accessRoutes)
		dispatch('tagsView/delAllViews', null, {
			root: true
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
