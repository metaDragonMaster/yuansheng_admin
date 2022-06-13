import request from '@/utils/request'

//获取用户列表
let api = {};
//用户登录
/*
  password	密码（用base64加密）	query	true	string
  username	用户名/手机号/邮箱	query	true	string
*/
api.login = function(data) {
	// data.password = window.btoa(data.password)
  return request({
    // url: '/manage/pwLogin',
    url: '/auth/pwLogin',
    method: 'post',
    params: {
			username:data.username,
			password:window.btoa(data.password)
		}
  })
}

// 获取用户信息
api.getInfo = function() {
  return request({
    // url: '/manage/userInfo',
    url: '/auth/userCenter',
    method: 'get',
  })
}

export default api
