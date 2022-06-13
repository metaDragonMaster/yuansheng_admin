import request from '@/utils/request'

//api 模块对象
let api = {};

/*
  添加合作社农户信息
  agriculturalIncome	农业收入(元)		false	string
  annualIncome	年总收入(元)		false string
  cooperativeId	合作社Id		false	integer(int32)
  dryLandArea	旱地面积(亩)		false	string
  farmerUserIdList	成员列表		false	array integer
  grassLandArea	牧草地面积(亩)		false	string
  hostId	户主id		false	integer(int32)
  house	住房情况（0无 1楼房 2平房 3瓦房 4危房 5其他）		false	integer(int32)
  houseArea	住房面积（平方米）		false	string
  houseBaseArea	宅基地面积（平方米）		false	string
  irrigatedLandArea	灌溉地面积(亩)		false	string
  lakeArea	湖面面积(亩)		false	string
  nurseryArea	苗圃面积(亩)		false	string
  paddyFieldArea	水田面积(亩)		false	string
  poolArea	池塘面积		false	string
  shrubberyArea	灌木林面积（亩）		false	string
  sparseWoodlandArea	疏林地面积（亩）		false	string
  traceWoodlandArea	迹地面积（亩）		false	string
*/
api.addFarmer = function(data) {
  return request({
    url: '/manage/cooperativeFarmerManage/addFarmer',
    method: 'post',
    params: data,
  })
}

/*
  查看指定合伙企业农户信息列表
  cooperativeId	合作社Id	query	false	integer(int32)
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  size	当前页面数据量	query	false	integer(int32)
*/
api.selectCooperativeFarmerList = function(data) {
  return request({
    url: '/manage/cooperativeFarmerManage/cooperativeFarmerList',
    method: 'get',
    params: data,
  })
}

/*
  移除农户成员
  farmerId	农户id	query	true	integer(int32)
*/
api.deleteFarmerById = function(farmerId) {
  return request({
    url: `/manage/cooperativeFarmerManage/delete/${farmerId}`,
    method: 'delete',
  })
}

/*
  查看农户信息
  farmerId	农户id	query	true	integer(int32)
*/
api.selectFarmerInfoById = function(farmerId) {
  return request({
    url: `/manage/cooperativeFarmerManage/farmerInfo?farmerId=${farmerId}`,
    method: 'get',
  });
}


/*
  查看农户信息列表
  // agriculturalIncome	农业收入(元)	query	false	string
  // annualIncome	年总收入(元)	query	false	string
  // cooperativeId	合作社id	query	false	integer(int32)
  // farmerUserIdList	成员列表	query	false	array integer
  // hostId	户主id	query	false	integer(int32)
  // house	住房情况（0无 1楼房 2平房 3瓦房 4危房 5其他）	query	false	integer(int32)
  // status	状态(0待审核，1已经提交人工审核，2审核成功，3失败，-1冻结)	query	false	integer(int32)

  // current	当前页码	query	false	integer(int32)
  // size	当前页面数据量	query	false	integer(int32)
  // field	排序字段	query	false	 string

  // dryLandArea	旱地面积(亩)	query	false	string
  // grassLandArea	牧草地面积(亩)	query	false	string
  // houseArea	住房面积（平方米）	query	false	string
  // houseBaseArea	宅基地面积（平方米）	query	false	string
  // irrigatedLandArea	灌溉地面积(亩)	query	false	string
  // lakeArea	湖面面积(亩)	query	false	string
  // nurseryArea	苗圃面积(亩)	query	false string
  // order	排序规则，asc升序，desc降序	query	false	string
  // paddyFieldArea	水田面积(亩)	query	false	string
  // poolArea	池塘面积	query	false	string
  // shrubberyArea	灌木林面积（亩）	query	false	string
  // sparseWoodlandArea	疏林地面积（亩）	query	false	string
  // traceWoodlandArea	迹地面积（亩）	query	false	string
  cooperativeId	合伙企业ID	query	true	integer(int32)
  address	通讯地址	query	false	string
  adminLv	管理员等级（0 普通成员，1一级管理员， 2二级管理员）	query	false	integer(int32)
  age	年龄	query	false	integer(int32)
  certificationNo	身份证号码	query	false	string
  cityNo	所在城市	query	false	string
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  farmerId	农户id	query	false	integer(int32)
  field	排序字段	query	false string
  health	健康状况（0 健康 1一般 2 欠佳）	query	false	integer(int32)
  isHost	是否是户主	query	false	boolean
  job	工作	query	false	string
  order	排序规则，asc升序，desc降序	query	false	string
  phoneNo	联系电话	query	false	string
  politicalStatus	政治面貌（0群众 1党员）	query	false integer(int32)
  realName	真实姓名	query	false	string
  sex	性别 0男 1女 2保密	query	false	string
  size	当前页面数据量	query	false	integer(int32)
*/
api.selectFarmerInfoList = function(data) {
  return request({
    url: '/manage/cooperativeFarmerManage/farmerInfoList',
    method: 'get',
    params: data
  })
}

/*
  farmerId	农户id	query	true	integer(int32)
  data:{
    agriculturalIncome	农业收入(元)		false	string
    annualIncome	年总收入(元)		false	string
    dryLandArea	旱地面积(亩)		false	string
    farmerUserIdList	成员列表		false	array integer
    grassLandArea	牧草地面积(亩)		false	string
    hostId	户主id		false	integer(int32)
    house	住房情况（0无 1楼房 2平房 3瓦房 4危房 5其他）		false	integer(int32)
    houseArea	住房面积（平方米）		false	string
    houseBaseArea	宅基地面积（平方米）		false	string
    irrigatedLandArea	灌溉地面积(亩)		false	string
    lakeArea	湖面面积(亩)		false	string
    nurseryArea	苗圃面积(亩)		false	string
    paddyFieldArea	水田面积(亩)		false	string
    poolArea	池塘面积		false	string
    shrubberyArea	灌木林面积（亩）		false	string
    sparseWoodlandArea	疏林地面积（亩）		false	string
    traceWoodlandArea	迹地面积（亩）		false	string
  }
*/
api.updateFarmerById = function(farmerId,data) {
  return request({
    url: `/manage/cooperativeFarmerManage/updateFarmer?farmerId=${farmerId}`,
    method: 'put',
    params: data
  })
}

export default api;
