export default class Observer {
	constructor(){
		this.events = [];
	}

	on(type, fn, context = this){
		var e = this.events.find(event => event.type === type);
		if(e) e = { type, fn };
		else this.events.push({ type, fn, context });
		return this;
	}

	off(type){
		var index = this.events.findIndex(event => event.type === type);
		if(index < 0) return;
		else this.events.splice(index, 1);
		return this;
	}

	emit(type){
		var e = this.events.find(event => event.type === type);
		if(e) e.fn.apply(e.context, [].slice.call(arguments, 1));
	}
}