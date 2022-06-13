import request from '@/utils/request'

//api 模块对象
let api = {};

/*
  查询商品列表
  approvalStatus	审核状态(-1: 待审核, 1: 审核通过, 0: 审核未通过)	query	false	integer(int32)
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  goodsComposeId	商品组合ID	query	false	integer(int32)
  goodsPsTypeId	配送方式	query	false	integer(int32)
  goodsTypeId	产品类型ID	query	false	integer(int32)
  goodsWeightTypeId	产品规格类型ID	query	false	integer(int32)
  merchantId	商户id	query	false	integer(int32)
  name	商品名称	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  priceFrom	最低商品价格	query	false	string
  priceTo	最高商品价格	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  status	状态	query	false	integer(int32)
*/
api.selectGoodsManageList = function(data) {
  return request({
    url: '/manage/goodsManage',
    method: 'get',
    params: data,
  })
}

/*
  添加商品
  goodsComposeId	商品组合ID	query	false	integer(int32)
  goodsPsTypeId	配送方式	query	false	integer(int32)
  goodsTypeId	产品类型ID	query	false	integer(int32)
  goodsWeightTypeId	产品规格类型ID	query	false	integer(int32)
  merchantId	商家ID	query	false	 integer(int32)
  name	商品名称	query	false	string
  price	商品价格	query	false	string
*/
api.addGoods = function(data) {
  return request({
    url: '/manage/goodsManage/add',
    method: 'post',
    params: data,
  })
}

/*
  添加商品信息
  detail	详细介绍	query	false	string
  goodsId	商品id	query	false	integer(int32)
  imageBig	大图	query	false	string
  imageList	图片列表	query	false	string
  imageSmall	小图	query	false	string
*/
api.addGoodsInfo = function(data) {
  return request({
    url: '/manage/goodsManage/addInfo',
    method: 'post',
    params: data,
  })
}

/*
  提交商品上架申请
  goodsId	商品ID
*/
api.setPutOnSaleById = function(goodsId) {
  return request({
    url: `/manage/goodsManage/commit/${goodsId}`,
    method: 'put',
  })
}

/*
  查询商品详情信息
  goodsId	商品ID
*/
api.selectGoodsInfoById = function(goodsId) {
  return request({
    url: `/manage/goodsManage/detail/${goodsId}`,
    method: 'get',
  })
}

/*
  下架商品 下架多个
  goodsIds	商品ID
*/
api.setPullOffShelvesByIds = function(goodsIds) {
  return request({
    url: `/manage/goodsManage/down/${goodsIds}`,
    method: 'put',
  })
}

/*
  修改商品
  goodsId	商品ID	path	true	integer(int32)
  batchCode	批次编号	query	false	string
  goodsPsTypeId	配送方式	query	false	integer(int32)
  goodsTypeId	产品类型ID	query	false	integer(int32)
  goodsWeightTypeId	产品规格类型ID	query	false	integer(int32)
  name	商品名称	query	false	string
  price	商品价格	query	false	string
*/
api.updateGoodsById = function(goodsId,data) {
  return request({
    url: `/manage/goodsManage/updateGoods/${goodsId}`,
    method: 'put',
    params: data
  })
}

/*
  修改商品信息
  goodsId	商品ID	query	true	integer(int32)
  detail	详细介绍	query	false	string
  imageBig	大图	query	false	string
  imageList	图片列表	query	false	string
  imageSmall	小图	query	false	string
*/
api.updateGoodsInfo = function(data) {
  return request({
    url: `/manage/goodsManage/updateGoodsInfo`,
    method: 'put',
    params: data
  })
}

/*
  删除商品
  goodsId	商品ID	path	true	integer(int32)
*/
api.deleteGoodsByIds = function(goodsIds) {
  return request({
    url: `/manage/goodsManage/${goodsIds}`,
    method: 'delete',
  })
}

export default api
