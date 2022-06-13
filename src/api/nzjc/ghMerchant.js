import request from '@/utils/request'

//api 模块对象
let api = {};

/*
	自动分配-返回预览结果
	goodsName	goodsName	query	true	string
*/
api.getGhMerchantAuto = function(data) {
  return request({
    url: `/manage/ghMerchant/auto`,
    method: 'post',
	params: data,
  })
};

/*
	提交结果
	jsonString	goodsName	query	true	string
*/
api.setGhMerchantCommit = function(data) {
  return request({
    url: `/manage/ghMerchant/commit`,
    method: 'post',
	params: data,
  })
};

/*
	goodsName	goodsName	path	true	string
	current		当前页码	query	false	integer(int32)
	field		排序字段	query	false	string
	order		排序规则，asc升序，desc降序	query	false	string
	size		当前页面数据量	query	false	integer(int32)
*/
api.selectGhMerchantInfoListByGoodsName = function(goodsName,data) {
  return request({
    url: `/manage/ghMerchant/ghMerchantInfoListByGoodsName/${goodsName}`,
    method: 'post',
	params: data,
  })
};


export default api;
