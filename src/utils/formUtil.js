"use strict"
export function filterHasValue(obj) {
	//过滤对象并返回有值的属性的对象
	let form = {};
	for (let i in obj) {
		if (!!obj[i]||obj[i] === 0) {
			form[i] = obj[i];
		}
	}
	return form;
}
export function excludeAttr(obj, excludes) {
	//过滤对象,排除所选的属性并返回剩余属性的对象
	let exc = [];
	let form = {};
	if (typeof(excludes) == 'string') {
		exc.push(excludes);
	} else {
		exc = [
			...excludes,
		];
	}
	// console.log(exc)
	for (let i in obj) {
		// console.log(!exc.includes(i))
		if (!exc.includes(i)) {
			form[i] = obj[i];
		}
	}
	return form;
}
export function combineAttrs(objA, objB) {
	//两个对象的相同属性结合然后赋值，返回第一个对象的值。
	//常用于打开修改模块时的表单赋值。
	let boo = false;
	for (let i in objA) {
		for (let j in objB) {
			boo = !!objB[j] || objB[j] == 0 ;
			if (i == j && boo) {
				objA[i] = objB[j];
			}
		}
	}
	return objA;
}
export function getItem(list, value, label) {
	// list 对象列表, value值, label列表中需要指定值的属性名
	//获取列表中含有指定值的对象
	let item = {};
	let valueLabel = label || 'value';
	list.map(obj => {
		if (value == obj[valueLabel]) {
			item = obj;
		}
	});
	if (!item) {
		item.label = '';
	}
	return item;
};
export function getItemLabel(list, value, valueAttr,labelAttr) {
	// list 对象列表, value值, valueAttr指定符合的属性名，labelAttr指定符合的属性名
	//获取列表中含有指定值的对象
	let item = {};
	let valueLabel = valueAttr || 'value';
	labelAttr = labelAttr || 'label'
	list.map(obj => {
		if (value == obj[valueLabel]) {
			item = obj;
		}
	});
	if (!item||JSON.stringify(item)=='{}') {
		item[labelAttr] = 'null';
	}
	// console.log(item,item[labelAttr])
	return item[labelAttr];
};

export function filterTextByLength(Text, length = 100, truncate = "...") {
	//根据输入的文字长度，隐藏移除文字并以省略号的形式表达溢出隐藏。
	//css无法解决文字溢出问题时用。
	let text = Text || ""
	if (text.length >= length) {
		return text.substring(0, length) + truncate;
	} else {
		if (text.length <= 0) {
			return ''
		}
		return text;
	}
}

export function stringToNumberArray(str, separate) {
	// 常用与ids字符串转换成数字类型的数组
	separate = separate || ',';
	return str.split(separate).map(item => parseInt(item));
}

export function removeDuplicationById(arr1,arr2,attrName) {
	// 传入的是两个对象形式的数组，并且必须有相同且数组内不重复的key值,key的属性名默认为'id'
	// 根据相同且当前数组内不重复值的key去重且合并。
	attrName = attrName || 'id';
	let ids = arr1.map(item=>item[attrName]);
	let add = arr2.filter(item=>!ids.includes(item[attrName]))
	return [].concat(add,familys);
}

const util = {
	filterHasValue,
	excludeAttr,
	filterTextByLength,
	combineAttrs,
	stringToNumberArray,
	getItem,
	getItemLabel,
};
export default util
