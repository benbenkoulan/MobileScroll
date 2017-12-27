'use strict'

import { getTransform } from './dom'
import { init, setPosition } from './func'
import { requestAnimationFrame, cancelAnimationFrame } from './raf'
import eventExtend from './event-extend'

const properties = ['deceleration', 'noBounce', 'wheel', 'slide', 'loop', 'noOutOfBounds', 'step', 'name', 'vertical', 'max', 'min']

function MobileScroll(el, options){
	this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.deceleration = options.deceleration || 0.006;	//参考减速度

	this.noOutOfBounds = !!options.noOutOfBounds; //不能越界
	this.noBounce = !!options.noBounce;	//弹性效果
	this.wheel = !!options.wheel;	//滚动轮效果
	this.slide = !!options.slide;	//滑动
	this.loop = !!options.loop;		//循环
	this.step = options.step;
	this.bounceThreshold = options.bounceThreshold || 0.5;	//弹性的阀值

	this.name = options.name;

	this.property = options.vertical ? 'Y' : 'X';
	this.vertical = !!options.vertical;

	this.min = options.min;
	this.max = options.max;

	this.isStart = false;
	this.isLocked = false;

	eventExtend(this);
	init.call(this);
}

MobileScroll.prototype.to = function(position, v, time, deceleration, direction){
	var beginTime = new Date();
	var _position = this.getPosition();
	var self = this;
	var id;
	var _to = function(){
		var dt = new Date() - beginTime;
		if(dt >= time){;
			setPosition.call(self, position);
			cancelAnimationFrame(id);
			self.trigger('moveEnd');
			return;
		}
		let d = (v * dt - dt * dt * deceleration / 2) * direction;
		let current = JSON.parse(JSON.stringify(_position));
		current[self.property] += d;
		setPosition.call(self, current);
		id = requestAnimationFrame(_to);
	}
	_to();
}

MobileScroll.prototype.getPosition = function(){
	return getTransform(this.scroller);
}

MobileScroll.prototype.getComputedPosition = function(d){
	var position = this.getPosition();
	position[this.property] += d;
	return position;
}

MobileScroll.prototype.slideTo = function(i, duration){
	if(i === undefined || !this.step) return;
	var d = -this.step * i;
	var position = this.getPosition();
	position[this.property] = d;
	setPosition.call(this, position, duration);
}

MobileScroll.prototype.getIndex = function(){
	if(!this.step) return;
	var position = this.getPosition();
	return Math.round(Math.abs(position[this.property]) / this.step);
}

MobileScroll.prototype.fixLoop = function(){
	var index = this.getIndex();
	if(index === 0){
		this.slideTo(this.itemLength - 2);
	} else if(index === this.itemLength - 1){
		this.slideTo(1);
	}
}

MobileScroll.prototype.startAutoPlay = function(interval, speed, direction = 1){
	if(interval <= speed){
		console.log('error:---interval need to be greater than speed---');
		return;
	}
	var self = this;
	this.autoPlayID = setInterval(function(){
		if(self.loop) self.fixLoop();
		if(!self.isTouchStart)self.slideTo(self.getIndex() + direction, speed);
	}, interval)
}

MobileScroll.prototype.stopAutoPlay = function(){
	if(!this.autoPlayID) return;
	clearInterval(this.autoPlayID);
	this.autoPlayID = undefined;
}

MobileScroll.prototype.pause = function(){
	this.scroller.style.transitionDuration = '0';
}

MobileScroll.prototype.updateOptions = function(options){
	for(let property in options){
		if(properties.indexOf(property) == -1) continue;
		this[property] = options[property];
	}
}

MobileScroll.prototype.destory = function(){
	this.stopAutoPlay();
	this.wrapper.removeEventListener('touchstart', this.startHandler);
	this.wrapper.removeEventListener('touchmove', this.moveHandler);
	this.wrapper.removeEventListener('touchend', this.endHandler);
}

export default MobileScroll;