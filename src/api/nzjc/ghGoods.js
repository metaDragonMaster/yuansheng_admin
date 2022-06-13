import request from '@/utils/request'

let api = {};

/*
	添加供货审商品
	chargePeriod	供货商品-账期		false	integer(int32)
	chargePeriodType	供货商品-账期类型		false	integer(int32)
	goodsImageList	供货商品-图片列表		false	array/object
	goodsName	供货商品名称		false	string
	goodsNum	供货商品数量		false	string
	goodsTitleImage	供货商品标题图片		false	string
	goodsTypeId	商品类型ID		false	integer(int32)
	goodsUnitPrice	供货商品单价		false	string
	goodsWeightTypeId	商品计重单位ID		false	integer(int32)
	logisticsChargeType	供货商品-物流类型		false	integer(int32)
	logisticsCompany	供货商品-物流公司		false	string
	logisticsPrice	供货商品-物流费用		false	string
	remark	备注		false	string
	userShopId	供货商品-品牌ID		false	integer(int32)
*/
api.addGood = function(data) {
	return request({
		url: '/manage/ghGoods/addGhGoods',
		method: 'post',
		data: data,
	})
}
/*
	修改供货商品
	chargePeriod	供货商品-账期		false	integer(int32)
	chargePeriodType	供货商品-账期类型		false	integer(int32)
	goodsImageList	供货商品-图片列表		false	array/object
	goodsName	供货商品名称		false	string
	goodsNum	供货商品数量		false	string
	goodsTitleImage	供货商品标题图片		false	string
	goodsTypeId	商品类型ID		false	integer(int32)
	goodsUnitPrice	供货商品单价		false	string
	goodsWeightTypeId	商品计重单位ID		false	integer(int32)
	logisticsChargeType	供货商品-物流类型		false	integer(int32)
	logisticsCompany	供货商品-物流公司		false	string
	logisticsPrice	供货商品-物流费用		false	string
	remark	备注		false	string
	userShopId	供货商品-品牌ID		false	integer(int32)
*/
api.updateGoodById = function(ghGoodsId,data) {
	return request({
		url: `/manage/ghGoods/edit/${ghGoodsId}`,
		method: 'put',
		data: data,
	})
}

/*
	审核
	ghGoodsId	ghGoodsId	query	true	 integer(int32)
	result	result	query	true	 boolean
*/
api.setAuditGoodById = function(cgGoodsId,data) {
	return request({
		url: `/manage/ghGoods/auditGoods/${cgGoodsId}`,
		method: 'post',
		params:data,
	})
}

/*
	删除供货商品
	
*/
api.deleteGoodById = function(ghGoodsId) {
	return request({
		url: `/manage/ghGoods/delete/${ghGoodsId}`,
		method: 'delete',
	})
}

/*
	获取供货商品详情
*/
api.getGoodInfoById = function(ghGoodsId) {
	return request({
		url: `/manage/ghGoods/detail/${ghGoodsId}`,
		method: 'get',
	})
}
/*
	获取供货商品列表
	current
	size
*/
api.selectGoodsList = function(data) {
	return request({
		url: `/manage/ghGoods/list`,
		method: 'get',
		params :data
	})
}


export default api
