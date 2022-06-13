import request,{exportExcel} from '@/utils/request';

//api 模块对象
let api = {};

/*
  查询系统日志
  createTimeFrom	起始时间		false	string
  createTimeTo	截止时间		false	string
  ip	操作者IP		false	string
  location	操作地点		false  string
  method	操作方法		false	string
  operation	操作内容		false	string
  userName	操作用户		false	string
  current	当前页码	query	false integer(int32)
  field	排序字段	query	false string
  order	排序规则，asc升序，desc降序	query	false string
  size	当前页面数据量	query	false   integer(int32)
*/
api.selectSystemLog = function(data) {
  return request({
    url: '/manage/system/log/list',
    method: 'get',
    params: data,
  })
}

/*
  导出日志
  createTimeFrom 起始时间	query	false	string
  createTimeTo 截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  ip 操作者IP	query	false	string
  location	操作地点	query	false	string
  method	操作方法	query	false	string
  operation	操作内容	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  userName	操作用户	query	false	string
*/
api.exportSystemLogToExcel = function(data) {
  return exportExcel({
    url: '/manage/system/log/excel',
    method: 'get',
    params: data,
  })
}

/*
  删除日志
  ids	日志ID	path	true
*/
api.deleteSystemLogByIds = function(ids) {
  return request({
    url: `/manage/system/log/${ids}`,
    method: 'delete',
  })
}

export default api
