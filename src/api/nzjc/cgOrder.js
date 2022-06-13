import request from '@/utils/request'

//api 模块对象
let api = {};

/*
	获取采购订单列表
	cgGoodsName	采购商品名称	query	false	string
	current		当前页码	query	false	integer(int32)
	endTime		结束时间	query	false	string
	field		排序字段	query	false	string
	order		排序规则，asc升序，desc降序	query	false	string
	size		当前页面数据量	query	false	integer(int32)
	startTime	开始时间	query	false	string
*/
api.selectCgOrderList = function(data) {
  return request({
    url: `/manage/cgOrder/cgOrderList`,
    method: 'get',
	params: data,
  })
};


export default api;
