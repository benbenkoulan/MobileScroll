'use strict'
import Observer from './observer';
import { setTransform, getTransform, setDuration, } from './dom';
import properties, { to, init, correct, checkStep, setPosition, checkMaxMin, } from './properties';
import deepClone, { preventTouchDefault, requestAnimationFrame, cancelAnimationFrame, } from './helpers';

export default class MobileScroll extends Observer {
	constructor(el, options){
		super();
		this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
		this.scroller = this.wrapper.children[0];
		this.deceleration = options.deceleration || 0.002;	//参考减速度

		this.noOutOfBounds = !!options.noOutOfBounds; //不能越界
		this.noBounce = !!options.noBounce;	//弹性效果
		this.wheel = !!options.wheel;	//滚动轮效果
		this.slide = !!options.slide;	//滑动
		this.loop = !!options.loop;		//循环
		this.step = options.step;
		this.bounceThreshold = options.bounceThreshold || 0.5;	//弹性的阀值
		this.interval = options.interval || 300;	//滑动间隔

		this.name = options.name;

		this.property = options.vertical ? 'Y' : 'X';
		this.vertical = !!options.vertical;

		this.min = options.min;
		this.max = options.max;

		this.isStart = false;
		this.isLocked = false;
		this[init]();
	}

	[checkStep](position) {
		if(this.step){
			position[this.property] = Math.round(position[this.property] / this.step) * this.step;
		}
	}

	[checkMaxMin](position) {
		if(this.min !== undefined && position[this.property] < this.min) position[this.property] = this.min;
		if(this.max !== undefined && position[this.property] > this.max) position[this.property] = this.max;
	}

	[correct](position) {
		this[checkStep](position);
		this[checkMaxMin](position);
	}

	[setPosition](position, duration = 0) {
		setDuration(this.scroller, `${duration}ms`);
		setTransform(this.scroller, `translate3d(${position.X}px, ${position.Y}px, 0)`);
		if(this.wheel){
			this.items.forEach((item, i) => {
				const deg = ((position.Y / this.step) + i) * this.step * this.bounceThreshold;
				setDuration(item, `${duration}ms`);
				setTransform(item, `rotateX(${deg}deg)`);
			})
		}
	}

	[to](position, v, time, deceleration, direction){
		const beginTime = new Date();
		const startPos = this.getPosition();
		const toFunc = () => {
			const dt = new Date() - beginTime;
			if(dt >= time || !time){;
				this[setPosition](position);
				cancelAnimationFrame(this.tickID);
				this.emit('end');
				return;
			}
			const d = (v * dt - dt * dt * deceleration / 2) * direction;
			const startPosCopy = deepClone(startPos);
			const current = this.getPosition();
			const delta = current[this.property] - startPosCopy[this.property];
			this.emit('move', delta);
			startPosCopy[this.property] += d;
			this[setPosition](startPosCopy);
			this.tickID = requestAnimationFrame(toFunc);
		}
		toFunc();
	}

	[init]() {
		this.items = Array.from(this.scroller.children);
		this.itemLength = this.items.length;
		this.index = 0;
		if(this.loop){
			const firstItem = this.items[0];
			const lastItem = this.items[this.itemLength - 1];
			this.scroller.insertBefore(lastItem.cloneNode(true), firstItem);
			this.scroller.appendChild(firstItem.cloneNode(true));
			this.items = Array.from(this.scroller.children);
			this.itemLength = this.items.length;
			this.index = 1;
			this.slideTo();
		}

		this.startHandler = (e) => {
			cancelAnimationFrame(this.tickID);
			if(this.loop) {
				this.fixLoop();
			}
			this.pause();
			this.isStart = true;
			this.startTime = new Date().getTime();

			const point = e.touches[0];
			this.startX = this.pointX = point.pageX;
			this.startY = this.pointY = point.pageY;

			this.distX = 0;
			this.distY = 0;

			this.start = this.moveStart = point[`page${this.property}`];

			this.directionLocked = '';
			this.isLocked = false;

			this.emit('start');
		}

		this.moveHandler = preventTouchDefault(function(e) {
			if(!this.isStart) return;

			const point = e.touches[0];
			let deltaX = point.pageX - this.pointX;
			let deltaY = point.pageY - this.pointY;

			this.pointX = point.pageX;
			this.pointY = point.pageY;

			this.distX += deltaX;
			this.distY += deltaY;

			if(!this.directionLocked){
				const absDisX = Math.abs(this.distX);
				const absDisY = Math.abs(this.distY);
				if(absDisX > absDisY + 2){
					this.directionLocked = 'h'
					if(this.vertical) this.isLocked = true; 
				} else if(absDisY > absDisX + 2){
					this.directionLocked = 'v'
					if(!this.vertical) this.isLocked = true;
				}
			}

			if(this.directionLocked == 'h'){
				deltaY = 0;
			} else if(this.directionLocked == 'v'){
				deltaX = 0;
			}

			const t = new Date();
			if(t - this.startTime > this.interval){
				this.moveStart = point[`page${this.property}`];
				this.startTime = t;
			}
			if((this.directionLocked == 'h' && !this.vertical) || (this.directionLocked == 'v' && this.vertical)){
				let delta = this.vertical ? deltaY : deltaX;
				const position = this.getComputedPosition(delta);
				if(this.noOutOfBounds) {
					const _position = this.getPosition();
					this[checkMaxMin](position);
					delta = position[this.property] - _position[this.property];
				}
				this[setPosition](position);
				this.emit('move', delta);
			}
		}, this);

		this.endHandler = (e) => {
			if(!this.isStart || this.isLocked) return;
			const current = e.changedTouches[0][`page${this.property}`];

			const t = new Date().getTime();
			const dt = t - this.startTime;

			const moveDistance = current - this.moveStart;
			const absMoveDistance = Math.abs(moveDistance);
			const direction = moveDistance > 0 ? 1 : -1;
			const position = this.getPosition();

			if(position[this.property] < this.max && position[this.property] > this.min && dt < this.interval && this.slide){
				const v = absMoveDistance / dt;
				let d = v * v / (2 * this.deceleration) * direction;
				const _position = deepClone(position);
				position[this.property] += d;
				this[correct](position);
				d = position[this.property] - _position[this.property];
				const deceleration = v * v / Math.abs(d) / 2;
				const duration = v / deceleration;
				this[to](position, v, duration, deceleration, direction);
			} else if(!this.noBounce) {
				if(this.step){
					const distance = current - this.start;
					const md = Math.abs(distance % this.step);
					let d;
					if(md > this.step * this.bounceThreshold){
						d = (this.step - md) * (distance > 0 ? 1 : -1);
					} else {
						d = md * (distance > 0 ? -1 : 1);
					}
						position[this.property] += d;
				}
				this[correct](position);
				this[setPosition](position, 500);
			}
			this.start = this.moveStart = 0;
			this.isStart = false;
		}

		this.transitionHandler = (e) => {
			if(e.target === this.scroller){
				this.emit('end');
			}
		}
		this.wrapper.addEventListener('touchstart', this.startHandler);
		this.wrapper.addEventListener('touchmove', this.moveHandler, { passive: false });
		this.wrapper.addEventListener('touchend', this.endHandler);
		this.scroller.addEventListener('transitionend', this.transitionHandler);
		this.scroller.addEventListener('webkitTransitionEnd', this.transitionHandler);
	}

	getPosition(){
		return getTransform(this.scroller);
	}

	getComputedPosition(d){
		const position = this.getPosition();
		position[this.property] += d;
		return position;
	}

	slideTo(i, duration){
		if(i === undefined || !this.step) return;
		const d = -this.step * i;
		const position = this.getPosition();
		const _d = position[this.property];
		position[this.property] = d;
		this[setPosition](position, duration);
		// setPosition.call(this, position, duration);
		this.emit('move', d - _d);
	}

	moveTo(d, duration = 0) {
		const position = this.getPosition();
		const _d = position[this.property];
		position[this.property] = d;
		this[setPosition](position, duration);
		// setPosition.call(this, position, duration);
		this.emit('move', d - _d);
	}

	stopMove() {
		cancelAnimationFrame(this.tickID);
	}

	getIndex(){
		if(!this.step) return;
		const position = this.getPosition();
		return Math.round(Math.abs(position[this.property]) / this.step);
	}

	fixLoop(){
		const index = this.getIndex();
		if(index === 0){
			this.slideTo(this.itemLength - 2);
		} else if(index === this.itemLength - 1){
			this.slideTo(1);
		}
	}

	startAutoPlay(interval = 0, speed, direction = 1){
		if(interval <= speed){
			console.error('error:---interval need to be greater than speed---');
			return;
		}
		this.autoPlayID = setInterval(() => {
			if(this.loop) this.fixLoop();
			if(!this.isStart) this.slideTo(this.getIndex() + direction, speed);
		}, interval);
	}

	stopAutoPlay(){
		if(this.autoPlayID === undefined || this.autoPlayID === null) return;
		clearInterval(this.autoPlayID);
		this.autoPlayID = null;
	}

	pause(){
		this.scroller.style.transitionDuration = 0;
	}

	updateOptions(options){
		for(const property in options){
			if(properties.indexOf(property) == -1) continue;
			this[property] = options[property];
		}
	}

	destroy(){
		this.stopAutoPlay();
		this.wrapper.removeEventListener('touchstart', this.startHandler);
		this.wrapper.removeEventListener('touchmove', this.moveHandler);
		this.wrapper.removeEventListener('touchend', this.endHandler);
		this.scroller.removeEventListener('transitionend', this.transitionHandler);
		this.scroller.removeEventListener('webkitTransitionEnd', this.transitionHandler);
		this.events = new Map();
		this.scroller = null;
		this.wrapper = null;
	}
}
