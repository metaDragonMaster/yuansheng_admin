import Vue from "vue"
import {
	MessageBox,
	Message
} from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
const _toString = (value, type) => {
	type = type.charAt(0).toUpperCase() + type.slice(1);
	return Object.prototype.toString.call(value) == `[object ${type}]`;
}
const $_Confirm = (option) => {
	/*
		该文件封装的是 elementui 的确认框，使用前请先下载elementui依赖
		封装规则
		主要是等待，
		要有等待时间waitTimes和等待函数waitFunc才会开始等待，跳过then需要有了前两者且设置notThen为true才能跳过。
		有了跳过可以不用设置thenFunc了，因为没有用。

		如果需要render设置html，请在使用函数的时候使用 vue 的 render
		let h = this.$createElement;
		然后把 content 的内容设置成h()函数设置的内容。
		content: h('p', null, [h('span', null, '内容可以是 '), h('i', { style: 'color: teal' }, 'VNode')]),
		得到的就是render函数渲染的内容了。
	*/
	/* 	示例
		//	let h = this.$createElement
    import $_Confirm from "@/utils/confirm.js"
		$_Confirm({
			title:"",
			content:"",
			thenFunc: async ()=>{
				console.log('axios请求');
			},
		});
		$_Confirm({
			title:"提示",
			content:"<strong>这是 <i>HTML</i> 片段</strong>",
			//content: h('p', null, [h('span', null, '内容可以是 '), h('i', { style: 'color: teal' }, 'VNode')]),
			toHtml:true,
			type:"warning",
			waitTimes:3000,
			waitFunc:()=>{
				console.log('确认前的等待');
			},
			notThen:true,//是否取消不用then
			thenFunc: async ()=>{
				console.log('axios请求');
			},
			catchFunc:()=>{
				console.log('axios请求取消');
			},
			cancels:["按键跳过","关闭跳过"]
		});
	 */
	//不把 beforeClose 提取出来的话，没有设置wait的时候会有无法进入then的问题
	let beforeClose = null;
	if(_toString(option.waitTimes,"number")&&_toString(option.waitFunc,"function")&&option.waitTimes>=1000&&option.waitTimes<=5000) {
		//只有设置了等待时间，等待函数且等待时间>=1000&&<=5000才会进来
		beforeClose = (action, instance, done) => {
			if (action === 'confirm') {
				instance.confirmButtonLoading = true;
				instance.confirmButtonText = '执行中...';
				// console.log("没有到计时器")
				option.waitFunc()
				setTimeout(() => {
					done();
					// console.log("外层")
					setTimeout(() => {
						// console.log("内层")
						instance.confirmButtonLoading = false;
					}, 300);
				}, option.waitTimes);
			} else {
				done();
			}
		};
	}
	MessageBox.confirm(option.content, option.title, {//
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: option.type || 'warning',
		dangerouslyUseHTMLString: option.toHtml || false,//是否把内容渲染成html
		distinguishCancelAndClose: true,//区分按钮关闭还是点击蒙层或ESC按钮关闭
		beforeClose:beforeClose,//等待
	}).then(() => {
		//要notThen为true时，thenFunc没有设置，等待函数不为null才能跳过thenFunc
		if(option.notThen===true&&!!option.thenFunc!=true&&!!beforeClose) return;
		if (!!option.thenFunc) {
			option.thenFunc()
		} else {
			Message.success("确定")
		}
	}).catch((action) => {
		// if(action === 'cancel'){
		// 	if (!!option.catchFunc) {
		// 		option.catchFunc()
		// 	} else {
		// 		Message.info(option.cancels?option.cancels[0]:"取消")
		// 	}
		// } else {
		// 	Message.info(option.cancels?option.cancels[1]:"取消")
		// }
	});
}
export default $_Confirm;
