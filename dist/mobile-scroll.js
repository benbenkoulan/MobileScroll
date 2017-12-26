module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = setTransform;
/* harmony export (immutable) */ __webpack_exports__["b"] = setDuration;
/* harmony export (immutable) */ __webpack_exports__["a"] = getTransform;
function setTransform(dom, value) {
	var style = dom.style;
	style.webkitTransform = style.MsTransform = style.msTransform = style.MozTransform = style.OTransform = style.transform = value;
}

function setDuration(dom, value) {
	var style = dom.style;
	style.transitionDuration = value;
}

function getTransform(dom) {
	var curTransform = void 0,
	    transformMatrix = void 0,
	    matrix = void 0;
	var curStyle = window.getComputedStyle(dom, null);
	if (window.WebKitCSSMatrix) {
		curTransform = curStyle.transform || curStyle.webkitTransform;
		if (curTransform.split(',').length > 6) {
			curTransform = curTransform.split(', ').map(function (a) {
				return a.replace(',', '.');
			}).join(', ');
		}
		transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
	} else {
		transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
		matrix = transformMatrix.toString().split(',');
	}
	var X = void 0,
	    Y = void 0;
	if (window.WebKitCSSMatrix) {
		Y = transformMatrix.m42;
		X = transformMatrix.m41;
	} else if (matrix.length === 16) {
		Y = parseFloat(matrix[13]);
		X = parseFloat(matrix[12]);
	} else {
		Y = parseFloat(matrix[5]);
		X = parseFloat(matrix[4]);
	}
	return { X: X, Y: Y };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__func__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__raf__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__event_extend__ = __webpack_require__(9);








var properties = ['deceleration', 'noBounce', 'wheel', 'slide', 'loop', 'noOutOfBounds', 'step', 'name', 'vertical', 'max', 'min'];

function MobileScroll(el, options) {
	this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.deceleration = options.deceleration || 0.006; //参考减速度

	this.noOutOfBounds = !!options.noOutOfBounds; //不能越界
	this.noBounce = !!options.noBounce; //弹性效果
	this.wheel = !!options.wheel; //滚动轮效果
	this.slide = !!options.slide; //滑动
	this.loop = !!options.loop; //循环
	this.step = options.step;
	this.bounceThreshold = options.bounceThreshold || 0.5; //弹性的阀值

	this.name = options.name;

	this.property = options.vertical ? 'Y' : 'X';
	this.vertical = !!options.vertical;

	this.min = options.min;
	this.max = options.max;

	this.isStart = false;
	this.isLocked = false;

	Object(__WEBPACK_IMPORTED_MODULE_4__event_extend__["a" /* default */])(this);
	__WEBPACK_IMPORTED_MODULE_2__func__["a" /* init */].call(this);
}

MobileScroll.prototype.to = function (position, v, time, deceleration, direction) {
	var beginTime = new Date();
	var _position = this.getPosition();
	var self = this;
	var id;
	var _to = function _to() {
		var dt = new Date() - beginTime;
		if (dt >= time) {
			;
			__WEBPACK_IMPORTED_MODULE_2__func__["b" /* setPosition */].call(self, position);
			Object(__WEBPACK_IMPORTED_MODULE_3__raf__["a" /* cancelAnimationFrame */])(id);
			self.trigger('moveEnd');
			return;
		}
		var d = (v * dt - dt * dt * deceleration / 2) * direction;
		var current = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(_position));
		current[self.property] += d;
		__WEBPACK_IMPORTED_MODULE_2__func__["b" /* setPosition */].call(self, current);
		id = Object(__WEBPACK_IMPORTED_MODULE_3__raf__["b" /* requestAnimationFrame */])(_to);
	};
	_to();
};

MobileScroll.prototype.getPosition = function () {
	return Object(__WEBPACK_IMPORTED_MODULE_1__dom__["a" /* getTransform */])(this.scroller);
};

MobileScroll.prototype.getComputedPosition = function (d) {
	var position = this.getPosition();
	position[this.property] += d;
	return position;
};

MobileScroll.prototype.slideTo = function (i, duration) {
	if (i === undefined || !this.step) return;
	var d = -this.step * i;
	var position = this.getPosition();
	position[this.property] = d;
	__WEBPACK_IMPORTED_MODULE_2__func__["b" /* setPosition */].call(this, position, duration);
};

MobileScroll.prototype.getIndex = function () {
	if (!this.step) return;
	var position = this.getPosition();
	return Math.round(Math.abs(position[this.property]) / this.step);
};

MobileScroll.prototype.fixLoop = function () {
	var index = this.getIndex();
	if (index === 0) {
		this.slideTo(this.itemLength - 2);
	} else if (index === this.itemLength - 1) {
		this.slideTo(1);
	}
};

MobileScroll.prototype.startAutoPlay = function (interval, speed) {
	var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	if (interval <= speed) {
		console.log('error:---interval need to be greater than speed---');
		return;
	}
	var self = this;
	this.autoPlayID = setInterval(function () {
		if (self.loop) self.fixLoop();
		if (!self.isTouchStart) self.slideTo(self.getIndex() + direction, speed);
	}, interval);
};

MobileScroll.prototype.stopAutoPlay = function () {
	if (!this.autoPlayID) return;
	clearInterval(this.autoPlayID);
	this.autoPlayID = undefined;
};

MobileScroll.prototype.pause = function () {
	this.scroller.style.transitionDuration = '0';
};

MobileScroll.prototype.updateOptions = function (options) {
	for (var property in options) {
		if (properties.indexOf(property) == -1) continue;
		this[property] = options[property];
	}
};

MobileScroll.prototype.destory = function () {
	this.stopAutoPlay();
	this.wrapper.removeEventListener('touchstart', this.startHandler);
	this.wrapper.removeEventListener('touchmove', this.moveHandler);
	this.wrapper.removeEventListener('touchend', this.endHandler);
};

/* harmony default export */ __webpack_exports__["default"] = (MobileScroll);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(5);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = init;
/* harmony export (immutable) */ __webpack_exports__["b"] = setPosition;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dom__ = __webpack_require__(1);



function preventDefault(fn, context) {
	return function (e) {
		if (/^touch/.test(e.type)) {
			e.preventDefault();
			fn.call(context, e);
		}
	};
}

function checkStep(position) {
	if (this.step) {
		position[this.property] = Math.round(position[this.property] / this.step) * this.step;
	}
}

function checkMaxMin(position) {
	if (this.min !== undefined && position[this.property] < this.min) position[this.property] = this.min;
	if (this.max !== undefined && position[this.property] > this.max) position[this.property] = this.max;
}

function correct(position) {
	checkStep.call(this, position);
	checkMaxMin.call(this, position);
}

function start(e) {
	if (this.loop) {
		this.fixLoop();
	}

	this.isStart = true;
	this.pause();
	this.startTime = new Date().getTime();

	var point = e.touches[0];
	this.startX = this.pointX = point.pageX;
	this.startY = this.pointY = point.pageY;

	this.distX = 0;
	this.distY = 0;

	this.start = this.moveStart = point['page' + this.property];

	this.directionLocked = '';
	this.isLocked = false;

	this.trigger('moveStart');
}

function move(e) {
	if (!this.isStart) return;

	var point = e.touches[0];
	var deltaX = point.pageX - this.pointX;
	var deltaY = point.pageY - this.pointY;

	this.pointX = point.pageX;
	this.pointY = point.pageY;

	this.distX += deltaX;
	this.distY += deltaY;

	if (!this.directionLocked) {
		var absDisX = Math.abs(this.distX);
		var absDisY = Math.abs(this.distY);
		if (absDisX > absDisY + 2) {
			this.directionLocked = 'h';
			if (this.vertical) this.isLocked = true;
		} else if (absDisY > absDisX + 2) {
			this.directionLocked = 'v';
			if (!this.vertical) this.isLocked = true;
		}
	}

	if (this.directionLocked == 'h') {
		deltaY = 0;
	} else if (this.directionLocked == 'v') {
		deltaX = 0;
	}

	var t = new Date().getTime();
	if (t - this.startTime > 300) {
		this.moveStart = point['page' + this.property];
		this.startTime = t;
	}
	if (this.directionLocked == 'h' && !this.vertical || this.directionLocked == 'v' && this.vertical) {
		var delta = this.vertical ? deltaY : deltaX;
		var position = this.getComputedPosition(delta);
		if (this.noOutOfBounds) {
			var _position = this.getPosition();
			checkMaxMin.call(this, position);
			delta = position[this.property] - _position[this.property];
		}
		setPosition.call(this, position);
		this.trigger('move', delta);
	}
}

function end(e) {
	if (!this.isStart || this.isLocked) return;
	var current = e.changedTouches[0]['page' + this.property];

	var t = new Date().getTime();
	var dt = t - this.startTime;

	var moveDistance = current - this.moveStart;
	var absMoveDistance = Math.abs(moveDistance);
	var direction = moveDistance > 0 ? 1 : -1;
	var position = this.getPosition();

	if (position[this.property] < this.max && position[this.property] > this.min && dt < 300 && absMoveDistance > 100 && this.slide) {
		var v = absMoveDistance / dt;
		var d = v * v / (2 * this.deceleration) * direction;
		var _position = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(position));
		position[this.property] += d;
		correct.call(this, position);
		d = position[this.property] - _position[this.property];
		var deceleration = v * v / Math.abs(d) / 2;
		var duration = v / deceleration;
		this.to(position, v, duration, deceleration, direction);
	} else if (!this.noBounce) {
		if (this.step) {
			var distance = current - this.start;
			var md = Math.abs(distance % this.step);
			var _d = void 0;
			if (md > this.step * this.bounceThreshold) {
				_d = (this.step - md) * (distance > 0 ? 1 : -1);
			} else {
				_d = md * (distance > 0 ? -1 : 1);
			}
			position[this.property] += _d;
		}
		correct.call(this, position);
		setPosition.call(this, position, 500);
	}
	this.start = this.moveStart = 0;
}

function init() {
	this.items = [].slice.call(this.scroller.children);
	this.itemLength = this.items.length;
	this.index = 0;
	if (this.loop) {
		var firstItem = this.items[0];
		var lastItem = this.items[this.itemLength - 1];
		this.scroller.insertBefore(lastItem.cloneNode(true), firstItem);
		this.scroller.appendChild(firstItem.cloneNode(true));
		this.items = [].slice.call(this.scroller.children);
		this.itemLength = this.items.length;
		this.index = 1;
		this.slideTo();
	}

	this.startHandler = start.bind(this);
	this.moveHandler = preventDefault(move, this);
	this.endHandler = end.bind(this);

	this.wrapper.addEventListener('touchstart', this.startHandler);
	this.wrapper.addEventListener('touchmove', this.moveHandler, { passive: false });
	this.wrapper.addEventListener('touchend', this.endHandler);

	var self = this;
	var transitionHandler = function transitionHandler(e) {
		if (e.target === self.scroller) {
			self.trigger('moveEnd');
		}
	};
	this.scroller.addEventListener('transitionend', transitionHandler);
	this.scroller.addEventListener('webkitTransitionEnd', transitionHandler);
}

function setPosition(position) {
	var _this = this;

	var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	Object(__WEBPACK_IMPORTED_MODULE_1__dom__["b" /* setDuration */])(this.scroller, duration + 'ms');
	Object(__WEBPACK_IMPORTED_MODULE_1__dom__["c" /* setTransform */])(this.scroller, 'translate3d(' + position.X + 'px, ' + position.Y + 'px, 0)');
	if (this.wheel) {
		this.items.forEach(function (item, i) {
			var deg = (position.Y / _this.step + i) * _this.step * _this.bounceThreshold;
			Object(__WEBPACK_IMPORTED_MODULE_1__dom__["b" /* setDuration */])(item, duration + 'ms');
			Object(__WEBPACK_IMPORTED_MODULE_1__dom__["c" /* setTransform */])(item, 'rotateX(' + deg + 'deg)');
		});
	}
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return requestAnimationFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cancelAnimationFrame; });
var requestAnimationFrame = function (global) {
	return global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || function (callback) {
		global.setInterval(callback, callback.interval || 1000 / 16);
	};
}(global || window);

var cancelAnimationFrame = function (global) {
	return global.cancelAnimationFrame || global.webkitCancelAnimationFrame || global.mozCancelAnimationFrame || function (id) {
		global.clearInterval(id);
	};
}(global || window);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = eventExtend;
function eventExtend(instance) {
	instance.events = [];

	instance.on = function (type, fn) {
		var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

		var e = this.events.find(function (event) {
			return event.type === type;
		});
		if (e) e = { type: type, fn: fn };else this.events.push({ type: type, fn: fn, context: context });
		return this;
	};

	instance.off = function (type) {
		var index = this.events.findIndex(function (event) {
			return event.type === type;
		});
		if (index < 0) return;else this.events.splice(index, 1);
		return this;
	};

	instance.trigger = function (type) {
		var e = this.events.find(function (event) {
			return event.type === type;
		});
		if (e) e.fn.apply(e.context, [].slice.call(arguments, 1));
	};
}

/***/ })
/******/ ]);