import { setTransform, setDuration } from './dom'
import { cancelAnimationFrame } from './raf'

function preventDefault(fn, context){
	return function(e){
		if(/^touch/.test(e.type)){
			e.preventDefault();	
			fn.call(context, e);
		}
	}
}

function checkStep(position){
	if(this.step){
		position[this.property] = Math.round(position[this.property] / this.step) * this.step;
	}
}

function checkMaxMin(position){
	if(this.min !== undefined && position[this.property] < this.min) position[this.property] = this.min;
	if(this.max !== undefined && position[this.property] > this.max) position[this.property] = this.max;
}

function correct(position){
	checkStep.call(this, position);
	checkMaxMin.call(this, position);
}

const startHandler = function(e) {
	cancelAnimationFrame(this.tickID);
	if(this.loop){
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

	this.emit('start');
}

const moveHandler = function(e) {
	if(!this.isStart) return;
	
	var point = e.touches[0];
	var deltaX = point.pageX - this.pointX;
	var deltaY = point.pageY - this.pointY;

	this.pointX = point.pageX;
	this.pointY = point.pageY;

	this.distX += deltaX;
	this.distY += deltaY;

	if(!this.directionLocked){
		let absDisX = Math.abs(this.distX);
		let absDisY = Math.abs(this.distY);
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

	var t = new Date().getTime();
	if(t - this.startTime > this.interval){
		this.moveStart = point['page' + this.property];
		this.startTime = t;
	}
	if((this.directionLocked == 'h' && !this.vertical) || (this.directionLocked == 'v' && this.vertical)){
		var delta = this.vertical ? deltaY : deltaX;
		var position = this.getComputedPosition(delta);
		if(this.noOutOfBounds) {
			let _position = this.getPosition();
			checkMaxMin.call(this, position);
			delta = position[this.property] - _position[this.property];
		}
		setPosition.call(this, position);
		this.emit('move', delta);
	}
}

const endHandler = function(e) {
	if(!this.isStart || this.isLocked) return;
	var current = e.changedTouches[0]['page' + this.property];

	var t = new Date().getTime();
	var dt = t - this.startTime;

	var moveDistance = current - this.moveStart;
	var absMoveDistance = Math.abs(moveDistance);
	var direction = moveDistance > 0 ? 1 : -1;
	var position = this.getPosition();

	if(position[this.property] < this.max && position[this.property] > this.min && dt < this.interval && this.slide){
		var v = absMoveDistance / dt;
		let d = v * v / (2 * this.deceleration) * direction;
		var _position = JSON.parse(JSON.stringify(position));
		position[this.property] += d;
		correct.call(this, position);
		d = position[this.property] - _position[this.property];
		var deceleration = v * v / Math.abs(d) / 2;
		var duration = v / deceleration;
		this.to(position, v, duration, deceleration, direction);
	} else if(!this.noBounce){
		if(this.step){
			let distance = current - this.start;
			let md = Math.abs(distance % this.step);
			let d;
			if(md > this.step * this.bounceThreshold){
				d = (this.step - md) * (distance > 0 ? 1 : -1);
			} else {
				d = md * (distance > 0 ? -1 : 1);
			}
			position[this.property] += d;
		}
		correct.call(this, position);
		setPosition.call(this, position, 500);
	}
	this.start = this.moveStart = 0;
}

const transitionHandler = function(e) {
	if(e.target === self.scroller){
		this.emit('end');
	}
}

export function init(){
	this.items = [].slice.call(this.scroller.children);
	this.itemLength = this.items.length;
	this.index = 0;
	if(this.loop){
		let firstItem = this.items[0];
		let lastItem = this.items[this.itemLength - 1];
		this.scroller.insertBefore(lastItem.cloneNode(true), firstItem);
		this.scroller.appendChild(firstItem.cloneNode(true));
		this.items = [].slice.call(this.scroller.children);
		this.itemLength = this.items.length;
		this.index = 1;
		this.slideTo();
	}


	this.startHandler = startHandler.bind(this);
	this.moveHandler = preventDefault(moveHandler, this);
	this.endHandler = endHandler.bind(this);
	this.transitionHandler = transitionHandler.bind(this);
	this.wrapper.addEventListener('touchstart', this.startHandler);
	this.wrapper.addEventListener('touchmove', this.moveHandler, { passive: false });
	this.wrapper.addEventListener('touchend', this.endHandler);

	
	this.scroller.addEventListener('transitionend', this.transitionHandler);
	this.scroller.addEventListener('webkitTransitionEnd', this.transitionHandler);
}

export function setPosition(position, duration = 0){
	setDuration(this.scroller, `${duration}ms`);
	setTransform(this.scroller, `translate3d(${position.X}px, ${position.Y}px, 0)`);
	if(this.wheel){
		this.items.forEach((item, i) => {
			let deg = ((position.Y / this.step) + i) * this.step * this.bounceThreshold;
			setDuration(item, `${duration}ms`);
			setTransform(item, `rotateX(${deg}deg)`);
		})
	}
}
