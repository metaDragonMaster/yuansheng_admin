//复制文本
export const mycopy = function(text) {
	let textareaEl = document.createElement('textarea');
	textareaEl.setAttribute('readonly', 'readonly'); // 防止手机上弹出软键盘
	textareaEl.value = text;
	document.body.appendChild(textareaEl);
	textareaEl.select();
	let success = document.execCommand('copy');
	document.body.removeChild(textareaEl);
	return success;
}