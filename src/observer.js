export default class Observer {
	constructor(){
		this.events = new Map();
	}

	on(type, fn, context = this){
		this.events.set(type, {
			fn,
			context,
		});
		return this;
	}

	off(type){
		this.events.remove(type);
		return this;
	}

	emit(type){
		if (this.events.has(type)) {
			const event = this.events.get(type);
			const args = Array.from(arguments).slice(1);
			event.fn.apply(event.context, args);
		}
	}
}