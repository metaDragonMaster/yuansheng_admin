import store from "@/store/index.js"
export default function (value) {
	let buttons = store.state.user.buttons;
	// console.log(value)
	// console.log(buttons.includes(value))
	return buttons.includes(value);
}