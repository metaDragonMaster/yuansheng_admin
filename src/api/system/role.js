import request,{exportExcel} from '@/utils/request';

//api 模块对象
let api = {};

/*
  角色分页列表
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  remark	角色描述	query	false	string
  roleName	角色名称	query	false	string
  size	当前页面数据量	query	false	integer(int32)
*/
api.selectRoleList = function(data) {
  return request({
    url: '/manage/system/role',
    method: 'get',
    params: data,
  })
}

/*
  添加角色
  remark	角色描述	query	false	string
  roleName	角色名称	query	false	string
*/
api.addRole = function(data) {
  return request({
    url: '/manage/system/role',
    method: 'post',
    params: data,
  })
}

/*
  导出角色数据
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  remark	角色描述	query	false	string
  roleName	角色名称	query	false	string
  size	当前页面数据量	query	false	integer(int32)
*/
api.exportRoleToExcel = function(data) {
  return exportExcel({
    url: '/manage/system/role/excel',
    method: 'get',
    params: data,
  })
}

/*
  获取所有角色数据
*/
api.getAllRoles = function() {
  return request({
    url: '/manage/system/role/options',
    method: 'get',
  })
}

/*
  修改角色权限
  roleId	角色ID	path	true	integer(int32)
  data:{
     menuIds    权限ID    query    true    string
  }
*/
api.updatePermissById = function(roleId,data) {
  return request({
    url: `/manage/system/role/updatePermiss/${roleId}`,
    method: 'put',
    params: data,
  })
}

/*
  修改角色
  roleId	角色ID	path	true	integer(int32)
  data:{
    remark	角色描述	query	false string
    roleName	角色名称	query	false	string
  }
*/
api.updateRoleById = function(roleId,data) {
  return request({
    url: `/manage/system/role/updateRole/${roleId}`,
    method: 'put',
    params: data,
  })
}

/*
  删除角色
  roleId	角色ID	path	true	integer(int32)
*/
api.deleteRoleById = function(roleId) {
  return request({
    url: `/manage/system/role/${roleId}`,
    method: 'delete',
  })
}

export default api
