import havePermission from "@/utils/havePermission.js"
function hideComponent(el, binding){
	let value = binding.value
	if(value.constructor == Array) {
		let remove = true;
		for(let i in value) {
			let _havePermission = havePermission(value[i])
			// console.log(value[i])
			// console.log(_havePermission)
			if(_havePermission == true) {
				remove = false;
				break;
			}
		}
		// console.log(remove)
		if(remove) {
			// el.parentNode.removeChild(el)
			el.style.display = 'none';
		}
	} else {
		let _havePermission = havePermission(value)
		// console.log(_havePermission)
		if(!!value&&!!el.parentNode&&_havePermission != true) {
			// console.log(el.style.display = 'none')
			// el.parentNode.removeChild(el)
			el.style.display = 'none';
		} else {
			el.style.display = ''
		}
	}
}
export default {
	//判定权限
	// bind(el, binding, vnode) { //只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
	// 	// console.log(binding)
	// 	// let value = binding.value
	// 	// let buttons = store.state.user.buttons
	// 	// let havePermission = buttons.includes(value)
	// },
	// inserted(el, binding) { //被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
	// 	console.log('inserted')
	// 	hideComponent(el, binding)
	// },
	// update(el, binding) { //所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前
	// 	console.log('update')
	// 	hideComponent(el, binding)
	// },
	componentUpdated(el, binding) { //指令所在组件的 VNode 及其子 VNode 全部更新后调用。
		// console.log('componentUpdated')
		hideComponent(el, binding)
	},
	// unbind() { //只调用一次，指令与元素解绑时调用。

	// },
}
