import request from '@/utils/request'

let api = {};

//激活店铺
api.setShopAliveById = function(shopId) {
	return request({
		url: `/manage/nzjc/shop/active/${shopId}`,
		method: 'put',
	})
}
// 添加店铺
api.addShop = function(data) {
	return request({
		url: `/manage/nzjc/shop/add`,
		method: 'post',
		params: data
	})
}
// 审核店铺
/*
	result	审核结果:true -- 通过 false -- 不通过	query	true	boolean
	resultExplain	审核结果说明	query	true	string
	shopId	品牌馆ID	query	true	integer(int32)
*/
api.setShopCheck = function(data) {
	return request({
		url: `/manage/nzjc/shop/check`,
		method: 'put',
		params: data
	})
}
// 冻结店铺
api.setShopFrost = function(shopId) {
	return request({
		url: `/manage/nzjc/shop/frost/${shopId}`,
		method: 'put',
	})
}
// 删除店铺
api.deleteShop = function(shopId) {
	return request({
		url: `/manage/nzjc/shop/delete/${shopId}`,
		method: 'delete',
	})
}
//查询店铺列表
/*
	current			当前页码			query	false	integer(int32)
	mainBusiness	主营			query	false	string
	regionId		地域ID			query	false	string
	shopName		品牌馆名称		query	false	string
	size			当前页面数据量	query	false	integer(int32)
	status			状态			(0待审核，1已经提交人工审核，2审核成功，3失败，-1冻结)	query	false	integer(int32)
	userId			用户ID			query	false	integer(int32)
*/
api.selectShopList = function(data) {
	return request({
		url: `/manage/nzjc/shop/shopList`,
		method: 'get',
		params: data
	})
}
//修改店铺信息
/*
	circleImageSmall	小图--品牌图标（圆形）	query	false	 string
	imageList	图片列表	query	false	 string
	introduction	介绍	query	false	 string
	mainBusiness	主营	query	false	 string
	regionId	地域ID	query	false	 integer(int32)
	shopName	品牌馆名称	query	false	 string
	squareImageSmall	小图--品牌图标（方形）	query	false	 string
*/
api.updateShop = function(data) {
	return request({
		url: `/manage/nzjc/shop/update`,
		method: 'put',
		params: data
	})
}


export default api
