import request from '@/utils/request'

//api 模块对象
let api = {};
/*
  添加合伙企业成员
  address	通讯地址	query	false string
  adminLv	管理员等级（0 普通成员，1一级管理员， 2二级管理员）	query	false	integer(int32)
  age	年龄	query	false	integer(int32)
  certificationNo	身份证号码	query	false	string
  cityNo	所在城市	query	false	string
  cooperativeId	合伙企业ID	query	false integer(int32)
  health	健康状况（0 健康 1一般 2 欠佳）	query	false	integer(int32)
  job	工作	query	false	string
  phoneNo	联系电话	query	false	string
  politicalStatus	政治面貌（0群众 1党员）	query	false	integer(int32)
  realName	真实姓名	query	false	string
  sex	性别 0男 1女 2保密	query	false	string
*/
api.addCooperativeUser = function(data) {
  return request({
    url: '/manage/cooperativeUserManage/add',
    method: 'post',
    params: data,
  })
}

/*
  删除合伙企业成员
  cooperativeUserIds	合伙企业成员ID
*/
api.deleteCooperativeUserByIds = function(cooperativeUserIds) {
  return request({
    url: `/manage/cooperativeUserManage/delete/${cooperativeUserIds}`,
    method: 'delete',
  })
}

/*
  查询合伙企业成员
  address	通讯地址	query	false	string
  adminLv	管理员等级（0 普通成员，1一级管理员， 2二级管理员）	query	false	integer(int32)
  age	年龄	query	false	integer(int32)
  certificationNo	身份证号码	query	false	string
  cityNo	所在城市	query	false	string
  cooperativeId	合作社id	query	false	integer(int32)
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  farmerId	农户id	query	false	integer(int32)
  field	排序字段	query	false	string
  health	健康状况（0 健康 1一般 2 欠佳）	query	false	integer(int32)
  isHost	是否是户主	query	false	boolean
  job	工作	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  phoneNo	联系电话	query	false	string
  politicalStatus	政治面貌（0群众 1党员）	query	false	integer(int32)
  realName	真实姓名	query	false string
  sex	性别 0男 1女 2保密	query	false string
  size	当前页面数据量	query	false	integer(int32)
  userId	用户id（整个用户系统的userId）	query	false	integer(int32)
*/
api.selectCooperativeUserList = function(data) {
  return request({
    url: '/manage/cooperativeUserManage/list',
    method: 'get',
    params: data
  })
}

/*
  设置合作社管理员
  cooperativeUserId	合作社成员id	path	true	integer(int32)
  data:{
    adminLv	管理员等级	query	true	integer(int32)
  }
*/
api.setUserAsAdminById = function(cooperativeUserId,data) {
  return request({
    url: `/manage/cooperativeUserManage/setAdmin/${cooperativeUserId}`,
    method: 'put',
    params: data
  })
}

/*
  修改合伙企业成员信息
  cooperativeUserId	合作社成员id	path	true	integer(int32)
  data:{
    address	通讯地址	query	false	string
    adminLv	管理员等级（0 普通成员，1一级管理员， 2二级管理员）	query	false	integer(int32)
    age	年龄	query	false	integer(int32)
    certificationNo	身份证号码	query	false	string
    cityNo	所在城市	query	false	string
    cooperativeId	合作社id	query	false	integer(int32)
    createTimeFrom	起始时间	query	false	string
    createTimeTo	截止时间	query	false	string
    farmerId	农户id	query	false	integer(int32)
    health	健康状况（0 健康 1一般 2 欠佳）	query	false	integer(int32)
    isHost	是否是户主	query	false	boolean
    job	工作	query	false	string
    phoneNo	联系电话	query	false	string
    politicalStatus	政治面貌（0群众 1党员）	query	false	integer(int32)
    realName	真实姓名	query	false	string
    sex	性别 0男 1女 2保密	query	false	string
    userId	用户id（整个用户系统的userId）	query	false	integer(int32)
  }
*/
api.updateUserInfoById = function(cooperativeUserId,data) {
  return request({
    url: `/manage/cooperativeUserManage/update/${cooperativeUserId}`,
    method: 'put',
    params: data
  })
}

export default api;
