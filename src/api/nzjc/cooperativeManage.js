import request from '@/utils/request'

//api 模块对象
let api = {};


/*
  激活合伙企业*
  cooperativeInfoId	合作社ID
*/
api.setActiveById = function(cooperativeInfoId) {
	return request({
		url: `/manage/cooperativeManage/active/${cooperativeInfoId}`,
		method: 'put',
	})
}

/*
  添加合伙企业银行账户信息
  cooperativeId	合伙企业ID	path	true	integer(int32)
  data: {
    bankName	开户行	query	false	string
    bankNo	银行卡号码	query	false	string
    bankPhoneNo	开户预留手机号	query	false	string
    bankUserName	银行卡开户人名字	query	false	string
  }
*/
api.addBankInfoById = function(cooperativeId, data) {
	return request({
		url: `/manage/cooperativeManage/addBankInfo/${cooperativeId}`,
		method: 'post',
		params: data
	})
}

/*
  添加合伙企业基本信息
  PId	父级合作社ID	query	false	integer(int32)
  address	详细地址	query	false	string
  certificationNo	身份证号码	query	false	string
  cityNo	所属城市	query	false	string
  contactCertificationNo	联系人身份证号码	query	false	string
  contactName	联系人姓名	query	false	string
  contactPhoneNo	联系人电话号码	query	false	string
  cooperativeLv	合作社等级（0村级 1县级）	query	false	integer(int32)
  licenseCode	营业执照编号	query	false	string
  mcc	经营类目	query	false	string
  phoneNo	联系电话	query	false	string
  realName	法人真实姓名	query	false	string
*/
api.addBaseInfo = function(data) {
	return request({
		url: '/manage/cooperativeManage/addBaseInfo',
		method: 'post',
		params: data
	})
}

/*
  添加合伙企业证件照信息
  cooperativeId	合伙企业ID	path	true	integer(int32)
  data:{
    bankCardFrontPhoto	银行卡正面	query	false	string
    legalCertificationBackPhoto	法人身份证反面	query	false	string
    legalCertificationFrontPhoto	法人身份证正面	query	false	string
    licenseCodePhoto	营业执照	query	false	string
  }
*/
api.addPhotoInfoById = function(cooperativeId, data) {
	return request({
		url: `/manage/cooperativeManage/addPhotoInfo/${cooperativeId}`,
		method: 'post',
		params: data
	})
}

/*
	查询银行信息

*/
api.selectBankInfo = function(data) {
	return request({
		url: `/manage/cooperativeManage/bankInfo`,
		method: 'get',
		params: data
	})
}

/*
	审核合伙企业
	cooperativeInfoId	合作社ID	path	true	integer(int32)
	pass	是否通过审核	query	true	boolean
	msg	未通过原因	query	false	string
*/
api.setCheckUserById = function(cooperativeInfoId,data) {
	return request({
		url: `/manage/cooperativeManage/check/${cooperativeInfoId}`,
		method: 'put',
		params: data,
	})
}

/*
  冻结合伙企业
  cooperativeInfoId	合作社ID
*/
api.setFrostUserById = function(cooperativeInfoId) {
	return request({
		url: `/manage/cooperativeManage/frost/${cooperativeInfoId}`,
		method: 'put',
	})
}

/*
  查询合伙企业列表
  PId	父级合作社ID	query	false	integer(int32)
  address	详细地址	query	false	string
  bankName	开户行	query	false	string
  bankNo	银行卡号码	query	false	string
  bankPhoneNo	开户预留手机号	query	false	string
  bankUserName	银行卡开户人名字	query	false	string
  certificationNo	身份证号码	query	false	string
  cityNo	所属城市	query	false	string
  contactCertificationNo	联系人身份证号码	query	false	string
  contactName	联系人姓名	query	false	string
  contactPhoneNo	联系人电话号码	query	false	string
  cooperativeLv	合作社等级（0村级 1县级）	query	false	integer(int32)
  createTimeFrom	起始时间	query	false	string
  createTimeTo	截止时间	query	false	string
  current	当前页码	query	false	integer(int32)
  field	排序字段	query	false	string
  licenseCode	营业执照编号	query	false	string
  mcc	经营类目	query	false	string
  order	排序规则，asc升序，desc降序	query	false string
  phoneNo	联系电话	query	false	string
  realName	法人真实姓名	query	false	string
  size	当前页面数据量	query	false	integer(int32)
  status	状态(0待上传图片 ，1待人工审核，2审核成功待打款验证，3成功，-1审核失败， -2打款验证失败，-3冻结)	query	false	integer(int32)
*/
api.selectCooperativeManageList = function(data) {
	return request({
		url: `/manage/cooperativeManage/list`,
		method: 'get',
		params: data
	})
}

/*
  修改合伙企业银行账户信息
  cooperativeId	合伙企业ID	path	true	integer(int32)
  data: {
    bankName	开户行	query	false	string
    bankNo	银行卡号码	query	false	string
    bankPhoneNo	开户预留手机号	query	false	string
    bankUserName	银行卡开户人名字	query	false	string
  }
*/
api.updateBankInfoById = function(cooperativeId, data) {
	return request({
		url: `/manage/cooperativeManage/updateBankInfo/${cooperativeId}`,
		method: 'put',
		params: data,
	});
}

/*
  修改合伙企业基本信息
  cooperativeId	合伙企业ID	path	true	 integer(int32)
  data:{
    PId	父级合作社ID	query	false	integer(int32)
    address	详细地址	query	false	string
    certificationNo	身份证号码	query	false	string
    cityNo	所属城市	query	false	string
    contactCertificationNo	联系人身份证号码	query	false	string
    contactName	联系人姓名	query	false	string
    contactPhoneNo	联系人电话号码	query	false	string
    cooperativeLv	合作社等级（0村级 1县级）	query	false	integer(int32)
    licenseCode	营业执照编号	query	false	string
    mcc	经营类目	query	false	string
    phoneNo	联系电话	query	false	string
    realName	法人真实姓名	query	false	string
  }
*/
api.updateBaseInfoById = function(cooperativeId, data) {
	return request({
		url: `/manage/cooperativeManage/updateBaseInfo/${cooperativeId}`,
		method: 'put',
		params: data,
	});
}

/*
  修改合伙企业证件照信息
  cooperativeId	合伙企业ID	path	true	integer(int32)
  data:{
    bankCardFrontPhoto	银行卡正面	query	false	string
    legalCertificationBackPhoto	法人身份证反面	query	false	string
    legalCertificationFrontPhoto	法人身份证正面	query	false	string
    licenseCodePhoto	营业执照	query	false	string
  }
*/
api.updatePhotoInfoById = function(cooperativeId, data) {
	return request({
		url: `/manage/cooperativeManage/updatePhotoInfo/${cooperativeId}`,
		method: 'put',
		params: data,
	});
}

export default api;
