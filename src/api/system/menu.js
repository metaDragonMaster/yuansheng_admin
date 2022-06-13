import request,{exportExcel} from '@/utils/request';

//api 模块对象
let api = {};
/*
	新增菜单				addMenu
	导出菜单				exportMenuToExcel
	查询菜单列表			selectMenuList
	查询当前用户菜单权限	selectPermissionsOfCurrentUser
	查询当前用户路由权限	selectRoutersOfCurrentUser
	删除菜单				deleteMenuByIds
	修改菜单				updateMenuById
*/

/*
  新增菜单
  component	对应Vue组件	query	false	string
  icon	图标	query	false	string
  menuName	菜单/按钮名称	query	false	string
  parentId	上级菜单ID	query	false	integer(int32)
  path	菜单URL	query	false	string
  perms	权限	query	false	string
  sort	排序	query	false	integer(int32)
  type	类型（0=菜单,1=按钮）	query	false	string
*/
api.addMenu = function(data) {
  return request({
    url: '/manage/system/menu',
    method: 'post',
    params: data,
  })
}

/*
  导出菜单
  component	对应Vue组件	query	false	string
  icon	图标	query	false	string
  menuName	菜单/按钮名称	query	false	string
  parentId	上级菜单ID	query	false	integer(int32)
  path	菜单URL	query	false	string
  perms	权限	query	false	string
  sort	排序	query	false	integer(int32)
  type	类型（0=菜单,1=按钮）	query	false	string
*/
api.exportMenuToExcel = function(data) {
  return exportExcel({
    url: '/manage/system/menu/excel',
    method: 'get',
    params: data,
  })
}

/*
  查询菜单列表
  component	对应Vue组件	query	false	string
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false string
  icon	图标	query	false	string
  menuName	菜单/按钮名称	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  parentId	上级菜单ID	query	false	integer(int32)
  path	菜单URL	query	false	string
  perms	权限	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  type	类型（0=按钮,1=菜单）	query	false	string
*/
api.selectMenuList = function(data) {
  return request({
    url: '/manage/system/menu/list',
    method: 'get',
    params: data,
  })
}

/*
  查询当前用户菜单权限
*/
api.selectPermissionsOfCurrentUser = function() {
  return request({
    url: '/manage/system/menu/permissions',
    method: 'get',
  })
}

/*
  查询当前用户路由权限
*/
api.selectRoutersOfCurrentUser = function() {
  return request({
    url: '/manage/system/menu/routers',
    method: 'get',
  })
}

/*
  删除菜单
*/
api.deleteMenuByIds = function(menuIds) {
  return request({
    url: `/manage/system/menu/${menuIds}`,
    method: 'delete',
  })
}

/*
  修改菜单
  menuId	菜单ID	path	true	integer(int32)
  component	对应Vue组件	query	false	string
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  icon	图标	query	false	string
  menuName	菜单/按钮名称	query	false	string
  parentId	上级菜单ID	query	false integer(int32)
  path	菜单URL	query	false string
  perms	权限	query	false	string
  type	类型（0=按钮,1=菜单）	query	false	string
*/
api.updateMenuById = function(menuId,data) {
  return request({
    url: `/manage/system/menu/${menuId}`,
    method: 'put',
    params: data
  })
}

export default api
