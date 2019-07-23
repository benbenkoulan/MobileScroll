export const preventTouchDefault = function(fn, context) {
	return function(e){
		if(/^touch/.test(e.type)){
			e.preventDefault();	
		}
		fn.call(context, e);
	}
}

export const deepClone = (obj, hash = new WeakMap()) => {
	if (obj instanceof Date) return new Date(obj);
	if (obj instanceof RegExp) return new RegExp(obj);
	if (obj === null || typeof obj !== 'object') return obj;

	if (hash.has(obj)) return obj; // 避免循环引用

	const o = new obj.constructor(); // 原型链上的属性可以被创建
	hash.set(o, null);
	for(const key in obj) {
		if (obj.hasOwnProperty(key)) {
			o[key] = deepClone(obj[key], hash);
		}
	}
	return o;
}

export const requestAnimationFrame = (g => (g.requestAnimationFrame || g.webkitRequestAnimationFrame || g.mozRequestAnimationFrame || (cb => g.setInterval(cb, cb.interval || 1000 / 16))))(global || window);

export const cancelAnimationFrame = (g => (g.cancelAnimationFrame || g.webkitCancelAnimationFrame || g.mozCancelAnimationFrame || (id => g.clearInterval(id))))(global || window);

export default {};
