import request, {
	exportExcel
} from '@/utils/request';

//获取用户列表
let api = {};
/*
  获取用户列表
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  deptId	部门ID	query	false	integer(int32)
  email	邮箱	query	false	string
  field	排序字段	query	false	string
  idNumber	身份证号	query	false string
  lastLoginTime	最近访问时间	query	false	string
  mobile	联系电话	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  password	密码	query	false	string
  realName	真实姓名	query	false	string
  roleId	角色ID	query	false	integer(int32)
  sex	0=男,1=女,2=保密	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  status	0=锁定,1=有效	query	false	string
  username	用户名	query	false	string
*/
api.selectUserList = function(data) {
	return request({
		url: '/manage/system/user',
		method: 'get',
		params: data
	})
}
/*
  新增用户
  mobile	联系电话	query	true	string
  password	密码	query	true	string
  roleIds	角色ID	query	true	string
  username	username	query	true	string
  deptId	部门ID	query	false	integer(int32)
  email	邮箱	query	false	string
  idNumber	身份证号	query	false	string
  realName	真实姓名	query	false	string
  sex	0=男,1=女,2=保密	query	false	string
*/
api.addUser = function(data) {
	return request({
		url: '/manage/system/user',
		method: 'post',
		params: data
	})
}
/*
  根据用户名查询用户
  username 用户名
*/
// api.selectUserByName = function(username) {
// 	return request({
// 		url: `/manage/system/user/check/${username}`,
// 		method: 'get',
// 	})
// }
/*
  导出用户数据
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  deptId	部门ID	query	false	integer(int32)
  email	邮箱	query	false	string
  field	排序字段	query	false	string
  idNumber	身份证号	query	false	string
  lastLoginTime	最近访问时间	query	false	string
  mobile	联系电话	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  password	密码	query	false	string
  realName	真实姓名	query	false	string
  roleIds	角色ID	query	false	string
  sex	0=男,1=女,2=保密	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  status	0=锁定,1=有效	query	false	string
  username	用户名	query	false	string
*/
api.exportUserToExcel = function(data) {
	return exportExcel({
		url: '/manage/system/user/excel',
		method: 'get',
		params: data
	})
}
/*
  展示近期访问记录 ---
*/
api.getUserVisitingRecord = function() {
	return request({
		url: '/manage/system/user/index',
		method: 'get',
	})
}
/*
	查询平台待开通店铺用户列表
*/
api.selectUserListToAddShop = function(data) {
	return request({
		url: '/manage/system/user/openShopUserList',
		method: 'get',
		params: data
	})
}


/*
  登录成功日志记录 ---
*/
api.getUserLoginSuccessLog = function() {
	return request({
		url: '/manage/system/user/success',
		method: 'get',
	})
}
/*
  查看用户权限 ---
  userId 用户ID
*/
api.checkUserPermissionById = function(userId) {
	return request({
		url: `/manage/system/user/${userId}`,
		method: 'get',
	})
}

/*only admin*/
/*
  修改用户（仅管理员操作）
  userId	用户ID	path	true	integer(int32)
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  deptId	部门ID	query	false	integer(int32)
  email	邮箱	query	false	string
  idNumber	身份证号	query	false	string
  lastLoginTime	最近访问时间	query	false	string
  mobile	联系电话	query	false	string
  password	密码	query	false	string
  realName	真实姓名	query	false	string
  roleIds	角色ID	query	false	string
  sex	0=男,1=女,2=保密	query	false	string
  status	0=锁定,1=有效	query	false	string
  username	用户名	query	false	string
*/
api.updateUserById = function(userId, data) {
	return request({
		url: `/manage/system/user/updateUser/${userId}`,
		method: 'put',
		params: data
	})
}
/*
  删除用户（仅管理员操作）
*/
api.deleteUserByIds = function(userIds) {
	return request({
		url: `/manage/system/user/${userIds}`,
		method: 'delete',
	})
}

export default api
