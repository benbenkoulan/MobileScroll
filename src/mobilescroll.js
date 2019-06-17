'use strict'
import Observer from './observer'
import { getTransform } from './dom'
import { init, setPosition, } from './func'
import { requestAnimationFrame, cancelAnimationFrame } from './raf'

const properties = ['deceleration', 'noBounce', 'wheel', 'slide', 'loop', 'noOutOfBounds', 'step', 'name', 'vertical', 'max', 'min']

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
		init.call(this);
	}

	to(position, v, time, deceleration, direction){
		const beginTime = new Date();
		const startPos = this.getPosition();
		const _to = () => {
			const dt = new Date() - beginTime;
			if(dt >= time || !time){;
				setPosition.call(this, position);
				cancelAnimationFrame(this.tickID);
				this.emit('end');
				return;
			}
			const d = (v * dt - dt * dt * deceleration / 2) * direction;
			const _startPos = JSON.parse(JSON.stringify(startPos));
			const current = this.getPosition();
			const delta = current[this.property] - _startPos[this.property];
			this.emit('move', delta);
			_startPos[this.property] += d;
			setPosition.call(this, _startPos);
			this.tickID = requestAnimationFrame(_to);
		}
		_to();
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
		setPosition.call(this, position, duration);
		this.emit('move', d - _d);
	}

	moveTo(d, duration = 0) {
		const position = this.getPosition();
		const _d = position[this.property];
		position[this.property] = d;
		setPosition.call(this, position, duration);
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
			console.log('error:---interval need to be greater than speed---');
			return;
		}
		this.autoPlayID = setInterval(() => {
			if(this.loop) this.fixLoop();
			if(!this.isTouchStart) this.slideTo(this.getIndex() + direction, speed);
		}, interval);
	}

	stopAutoPlay(){
		if(!this.autoPlayID) return;
		clearInterval(this.autoPlayID);
		this.autoPlayID = null;
	}

	pause(){
		this.scroller.style.transitionDuration = '0';
	}

	updateOptions(options){
		for(let property in options){
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
		this.events = [];
		this.wrapper = null;
		this.scroller = null;
	}
}