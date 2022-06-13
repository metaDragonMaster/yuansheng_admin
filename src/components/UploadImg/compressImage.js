/** 图片压缩，默认同比例压缩
 *  @param {Object} fileObj
 *  图片对象
 *  回调函数有一个参数，base64的字符串数据
 */
// export function compress(fileObj, callback) {
export function compress(fileObj) {
	return new Promise(function(resolve, reject) {
		try {
			// console.log("compress fileObj", fileObj)
			// let request = null;
			const image = new Image()
			image.src = URL.createObjectURL(fileObj)
			image.onload = async function() {
				const that = this
				// 默认按比例压缩
				let w = that.width
				let h = that.height
				const scale = w / h
				w = fileObj.width || w
				h = fileObj.height || (w / scale)
				let quality = 0.7 // 默认图片质量为0.7
				// 生成canvas
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')
				// 创建属性节点
				const anw = document.createAttribute('width')
				anw.nodeValue = w
				const anh = document.createAttribute('height')
				anh.nodeValue = h
				canvas.setAttributeNode(anw)
				canvas.setAttributeNode(anh)
				ctx.drawImage(that, 0, 0, w, h)
				// 图像质量
				if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
					quality = fileObj.quality
				}
				// quality值越小，所绘制出的图像越模糊
				const data = canvas.toDataURL('image/jpeg', quality) //0-1
				// 压缩完成执行回调
				const newFile = dataURLtoBlob(data)
				// request = await callback(newFile)
				// console.log("try", request)
				resolve(newFile);
			}
			// return request
		} catch (e) {
			console.log('压缩失败!')
			reject(e)
		}
	});
}

function convertBase64UrlToBlob(urlData) {
	const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
	// 处理异常,将ascii码小于0的转换为大于0
	const ab = new ArrayBuffer(bytes.length)
	const ia = new Uint8Array(ab)
	for (let i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i)
	}
	return new Blob([ab], {
		type: 'image/png'
	})
}

function dataURLtoBlob(dataurl) { // 转换为二进制流
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {
		type: mime
	});
}

function dataURLtoFile(dataurl, filename) { // 转换为文件流
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, {
		type: mime
	});
}
