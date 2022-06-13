import axios from 'axios';
import {
	Message
} from 'element-ui';
import router from "@/router/index.js";
import store from '@/store';
import {
	getToken
} from '@/utils/auth';
import moment from "moment";

const baseURL = process.env.VUE_APP_BASE_API; // 线上
// const baseURL = 'http://192.168.1.73:8301/'; // 刘书华
// const baseURL = 'http://192.168.1.21:8301/'; // 王增环
// const baseURL = 'http://192.168.1.249:8301/'; // 蒋鹏

const paramsSerializer = function(params) {
	let result = [];
	// console.log('paramsSerializer',params)
	for (let field in params) {
		if (params[field] === undefined) {
			result.push(`${field}=`);
			continue
		}
		if (Array.isArray(params[field])) {
			result.push(params[field].map(item => `${field}=${item}`).join("&"));
		} else {
			result.push(`${field}=${params[field]}`);
		}
	}
	return result.join("&");
};


export const exportExcel = axios.create({
	baseURL: baseURL,
	timeout: 5000, // request timeout
	headers: {
		"Content-Type": "application/json",
		'Authorization-admin': getToken(),
	},
	responseType: "blob",
	paramsSerializer: paramsSerializer
});
exportExcel.interceptors.response.use(
	response => {
		let {
			status,
			data,
			headers
		} = response;
		if (status == 200) {
			let blob = new Blob([data], {
				type: 'application/vnd.ms-excel'
			});
			let contentDisposition = headers['content-disposition'];
			console.log(contentDisposition)
			let filename = moment().format('yyyy-MM-DD') + ' ' + window.decodeURI(contentDisposition.split('=')[1],
				"UTF-8");
			// let filename = contentDisposition.replace('attachment;filename*=utf-8', '');
			console.log(filename)
			let downloadElement = document.createElement('a');
			let href = window.URL.createObjectURL(blob);
			document.body.appendChild(downloadElement);
			downloadElement.style.display = 'none';
			downloadElement.href = href;
			downloadElement.download = decodeURI(filename);
			// console.log(downloadElement);
			//触发a链接的点击事件并移除消耗。
			let DownloadEvt = document.createEvent('MouseEvents');
			DownloadEvt.initEvent('click', true, false);
			downloadElement.dispatchEvent(DownloadEvt);
			document.body.removeChild(downloadElement);
			window.URL.revokeObjectURL(href);
		}
	},
	error => {
		if (error.response.status == 401) {
			Message({
				message: error.response.data.msg,
				type: 'error',
				duration: 3000
			})
			store.dispatch('user/logout');
			router.push({
				path: `/login`,
				query: {
					"redirect": router.fullPath
				}
			});
			return;
		}
		if (error.response.status == 500) {
			Message({
				message: error.response.data.msg,
				type: 'error',
				duration: 3000
			})
			router.push({
				path: `/500`,
				query: {
					"redirect": router.fullPath
				}
			});
			return;
		}
		// console.log('err ：', error,...error) // for debug
		Message({
			message: error.msg,
			type: 'error',
			duration: 3000
		})
		return Promise.reject(error)
	}
);

// console.log("VUE_APP_BASE_API",process.env.VUE_APP_BASE_API)
const service = axios.create({
	baseURL: baseURL, // 刘书华
	timeout: 5000, // request timeout
	headers: {
		"Content-Type": "application/json"
	},
	paramsSerializer: paramsSerializer
});

// request interceptor
service.interceptors.request.use(
	config => {
		if (store.getters.token) {
			config.headers['Authorization'] = getToken()
		}
		// console.log(config)
		return config
	},
	error => {
		console.log("请求错误", error) // for debug
		return Promise.reject(error)
	}
);

// response interceptor
service.interceptors.response.use(
	response => {
		// console.log(typeof(response.data))
		// console.log(response)
		const res = response.data;
		if (res.code !== 10200) {
			Message({
				message: res.msg || 'Error',
				type: 'error',
				duration: 3000
			})
			return Promise.reject(new Error(res || 'Error'))
		} else {
			return res
		}
	},
	error => {
		// console.log("error:-->", error)
		// console.log("error:-->", error.response)
		// console.log("error:-->", error.response.status)
		// console.log("error ***:-->", error.response.data.msg)
		console.log("error ***:-->", error.response.status,error.response.data);
		if(error.response.status!=200) {
			Message({
				message: error.response.data.msg,
				type: 'error',
				duration: 3000
			})
			if (error.response.status == 401) {
				store.dispatch('user/logout');
				router.push({
					path: `/login`,
					query: {
						"redirect": router.fullPath
					}
				});
			}
			// if (error.response.status == 403) {
			// }
			// if (error.response.status == 500) {
			// 	// router.push({path:`/500`,query:{"redirect":router.fullPath}});
			// }
		}
		return Promise.reject(error);
	}
);

export default service;
