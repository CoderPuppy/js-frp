const fn = exports

fn.injectGlobal = function() {
	fn.inject(Object.prototype)
	return fn
}

fn.inject = function(obj) {
	obj.do = fn.do.self

	return obj
}

fn.do = function(self) {
	const ops = [].slice.call(arguments)
	return function(self) {
		return ops.reduce(function(self, op) {
			return op(self)
		}, self)
	}
}

fn.do.self = function() {
	return fn.do.apply(fn, arguments)(this)
}

fn.id = function() { return function(v) { return v } }

fn.map = function(fn) { return fn }

fn.reverse = function(fn, other) {
	if(typeof(fn) != 'function') throw new TypeError('fn.reverse requires a function')
	return function(self) {
		return fn(self)(other)
	}
}

fn.instance = function(fn) {
	return function() {
		return fn.apply(null, arguments)(this)
	}
}