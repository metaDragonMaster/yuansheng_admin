import request from '@/utils/request'

//api 模块对象
let api = {};

/*
  商户管理员商品审核
  auditId	审核记录ID	path	true	integer(int32)
  msg	审核结果信息	query	false	string
  status	审核状态(1: 审核通过，2：审核未通过)	query	false	integer(int32)
*/
api.setAuditGoodsStatusById = function(auditId,data) {
  return request({
    url: `/manage/goodsAuditManage/audit/${auditId}`,
    method: 'put',
    params: data,
  })
}

/*
  商户管理员商品审核
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  goodsId	商品id	query	false	integer(int32)
  msg	审核结果信息	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  status	审核状态(-1: 未审核,0:审核中，1: 审核通过，2：审核未通过)	query	false	integer(int32)
*/
api.selectMerchantAuditList = function(data) {
  return request({
    url: `/manage/goodsAuditManage/merchantAuditList`,
    method: 'get',
    params: data,
  })
}

/*
  平台审核商品
  auditId	审核记录ID	path	true	integer(int32)
  msg	审核结果信息	query	false	string
  status	审核状态(1: 审核通过，2：审核未通过)	query	false	integer(int32)
*/
api.setPlatformAuditGoodsStatusById = function(auditId,data) {
  return request({
    url: `/manage/goodsAuditManage/platformAudit/${auditId}`,
    method: 'put',
    params: data,
  })
}

/*
  平台查询商品审核列表
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  goodsId	商品id	query	false	integer(int32)
  msg	审核结果信息	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  status	审核状态(-1: 未审核,0:审核中，1: 审核通过，2：审核未通过)	query	false	integer(int32)
*/
api.selectPlatformAuditList = function(data) {
  return request({
    url: `/manage/goodsAuditManage/platformAuditList`,
    method: 'get',
    params: data,
  })
}

export default api
