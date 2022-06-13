import request from '@/utils/request'

let api = {};

/*
	添加供货审商品
	cashPayNum	现金支付数量		false	string
	cooperativeInfoId	合作社ID(需要有权限))		false	integer(int32)
	endTime	最迟发货时间		false	string
	financePayNum	金融支付数量		false	string
	goodsDetailAddress	采购商品-详细收货地址		false	string
	goodsImageList	采购商品-图片列表		false	string
	goodsInfoRichText	富文本描述		false	string
	goodsName	采购商品名称		true	string
	goodsNum	采购商品数量		true	string
	goodsProductAddress	采购商品-产地		false	string
	goodsTitleImage	采购商品标题图片		true	string
	goodsTypeId	商品类型ID		true	integer(int32)
	goodsWeightTypeId	采购商品计重单位ID		true	integer(int32)
	isNeedFinance	是否需要金融服务		false	boolean
	isNowRelease	是否立即发货		false	boolean
	remark	备注		false	string
	status	采购商品状态		false	integer(int32)
	userShopId	采购商品-品牌馆ID		false	integer(int32)
*/
api.addGood = function(data) {
	return request({
		url: '/manage/cgGoods/addCgGoods',
		method: 'post',
		data: data,
	})
}
/*
	修改供货商品
	cashPayNum	现金支付数量		false	string
	cooperativeInfoId	合作社ID(需要有权限))		false	integer(int32)
	endTime	最迟发货时间		false	string
	financePayNum	金融支付数量		false	string
	goodsDetailAddress	采购商品-详细收货地址		false	string
	goodsImageList	采购商品-图片列表		false	string
	goodsInfoRichText	富文本描述		false	string
	goodsName	采购商品名称		true	string
	goodsNum	采购商品数量		true	string
	goodsProductAddress	采购商品-产地		false	string
	goodsTitleImage	采购商品标题图片		true	string
	goodsTypeId	商品类型ID		true	integer(int32)
	goodsWeightTypeId	采购商品计重单位ID		true	integer(int32)
	isNeedFinance	是否需要金融服务		false	boolean
	isNowRelease	是否立即发货		false	boolean
	remark	备注		false	string
	status	采购商品状态		false	integer(int32)
	userShopId	采购商品-品牌馆ID		false	integer(int32)
*/
api.updateGoodById = function(cgGoodsId,data) {
	return request({
		url: `/manage/cgGoods/edit/${cgGoodsId}`,
		method: 'put',
		data: data,
	})
}

/*
	审核
	cgGoodsId	cgGoodsId	query	true	 integer(int32)
	result	result	query	true	 boolean
*/
api.setAuditGoodById = function(cgGoodsId,data) {
	return request({
		url: `/manage/cgGoods/auditGoods/${cgGoodsId}`,
		method: 'post',
		params:data,
	})
}

/*
	删除供货商品
	
*/
api.deleteGoodById = function(cgGoodsId) {
	return request({
		url: `/manage/cgGoods/delete/${cgGoodsId}`,
		method: 'delete',
	})
}

/*
	获取供货商品详情
*/
api.getGoodInfoById = function(cgGoodsId) {
	return request({
		url: `/manage/cgGoods/detail/${cgGoodsId}`,
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
		url: `/manage/cgGoods/list`,
		method: 'get',
		params :data
	})
}


export default api
