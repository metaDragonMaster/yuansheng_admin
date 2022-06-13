import request from '@/utils/request'

//api 模块对象
let api = {};
/*
	获取商品类型列表
*/
api.getGoodsType = function() {
	return request({
		url: `/manage/goodsType`,
		method: 'get',
	})
}

export default api
