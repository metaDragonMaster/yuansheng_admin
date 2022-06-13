import request from '@/utils/request'

//api 模块对象
let api = {};

/*
	获取商品规格类型列表
*/
api.getGoodsPsType = function() {
  return request({
    url: `/manage/goodPsType`,
    method: 'get',
  })
}

export default api
