import request from '@/utils/request'

//api 模块对象
let api = {};
/*
	获取商品规格类型列表
*/
api.getGoodsWeightType = function() {
  return request({
    url: `/manage/goodsWeightType`,
    method: 'get',
  })
}

export default api
