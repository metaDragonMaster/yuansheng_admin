import request from '@/utils/request';

//api 模块对象
let api = {};

api.getOssPolicy = function(data) {
  return request({
    url: '/manage/oss/getOssPolicy',
    method: 'get',
	params: data
  })
}

export default api;
