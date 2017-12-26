export const requestAnimationFrame = ((global) =>{
	return global.requestAnimationFrame || 
		global.webkitRequestAnimationFrame ||
		global.mozRequestAnimationFrame ||
		function(callback){
			global.setInterval(callback, callback.interval || 1000 / 16);
		}
})(global || window)


export const cancelAnimationFrame = ((global) =>{
	return global.cancelAnimationFrame || 
		global.webkitCancelAnimationFrame ||
		global.mozCancelAnimationFrame ||
		function(id){
			global.clearInterval(id);
		}
})(global || window)