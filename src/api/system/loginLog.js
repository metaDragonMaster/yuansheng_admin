import request,{exportExcel} from '@/utils/request';

//api 模块对象
let api = {};
/*
  browser	登录浏览器	query	false	string
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  ip	登录 IP	query	false	string
  location	登录地点	query	false	string
  loginTime	登录时间	query	false	string
  order	排序规则，asc升序，desc降序	query	false string
  os	操作系统	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  username	登录用户	query	false	string
*/
api.selectLoginLog = function(data) {
  return request({
    url: '/manage/system/loginLog',
    method: 'get',
    params: data,
  })
}

/*
  展示当前用户登录记录
*/
api.getLoginLogOfCurrentUser = function() {
  return request({
    url: '/manage/system/loginLog/currentUser',
    method: 'get',
  })
}

/*
  导出登录日志数据
  browser	登录浏览器	query	false	string
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false string
  ip	登录 IP	query	false	string
  location	登录地点	query	false	string
  loginTime	登录时间	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  os	操作系统	query	false	string
  size	当前页面数据量	query	false integer(int32)
  username	登录用户	query	false	string
*/
api.exportLoginLogToExcel = function(data) {
  return exportExcel({
    url: '/manage/system/loginLog/excel',
    method: 'get',
    params: data
  })
}

/*
  删除登录日志
  ids
*/
api.deleteLoginLogByIds = function(ids) {
  return request({
    url: `/manage/system/loginLog/${ids}`,
    method: 'delete',
  })
}


export default api
