import request from '@/utils/request'

let api = {};

//添加宣传图信息
api.addPropagate = function(data) {
	return request({
		url: '/manage/nzjc/propagate/add',
		method: 'post',
		params: data
	})
}
//删除宣传图信息
api.deletePropagateById = function(propagatePhotoId, shopPropagateId) {
	return request({
		url: `/manage/nzjc/propagate/delete/${propagatePhotoId}`,
		method: 'delete',
		params: {
			'shopPropagateId': shopPropagateId
		}
	})
}
//获取品牌馆宣传图信息列表
api.selectPropagateList = function() {
	return request({
		url: '/manage/nzjc/propagate/propagateList',
		method: 'get',
	})
}
//修改宣传图信息
api.updatePropagate = function(data) {
	return request({
		url: '/manage/nzjc/propagate/update',
		method: 'put',
		params:data
	})
}

export default api
