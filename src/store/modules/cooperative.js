const state = {
	cooperativeInfo: null,
}

const mutations = {
	SET_COOPERATIVE_INFO: (state, row) => {
		state.cooperativeInfo = row;
	},
}

const actions = {
	// remove token
	setCooperativeInfo({
		commit
	}, row) {
		commit('SET_COOPERATIVE_INFO', row);
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
