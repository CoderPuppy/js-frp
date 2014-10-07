const fn = require('../fn')

function isInt(i) {
	return typeof(i) == 'number' && i % 1 == 0
}

function vec() {
	return vec.extend([].slice.call(arguments))
}

vec.ofSize = function(size) {
	return vec.extend(new Array(size))
}

vec.extend = function(arr) {
	fn.inject(arr)

	delete arr.pop
	delete arr.push
	delete arr.shift
	delete arr.unshift
	delete arr.splice

	arr.toString = fn.instance(vec.toString)
	arr.inspect  = fn.instance(vec.toString)
	arr.toArray  = fn.instance(vec.toArray)
	arr.reverse  = fn.instance(vec.reverse)
	arr.slice    = fn.instance(vec.slice)
	arr.map      = fn.instance(vec.map)
	arr.add      = fn.instance(vec.add)
	arr.sub      = fn.instance(vec.sub)

	arr.combine = function(fn, other) {
		if(Array.isArray(other))
			return vec.combine(fn, other)(this)
		
		const self = this
		const combiner = vec.combine(fn)
		return function() {
			return combiner.apply(null, arguments)(self)
		}
	}

	return arr
}

vec.toString = function() {
	return function(self) {
		return '(' + [].join.call(self, ', ') + ')'
	}
}

vec.toArray = function() {
	return function(self) {
		return vec.extend([].slice.call(self))
	}
}

vec.map = function(fn) {
	if(typeof(fn) != 'function') throw new TypeError('fn.vec.map requires a function')
	return function(self) {
		return vec.extend([].map.call(self, fn))
	}
}

vec.slice = function(start, length) {
	if(!isInt(length)) {
		length = start
		start = 0
	}
	if(!isInt(start))
		throw new TypeError('start needs to be an integer')
	if(!isInt(length))
		throw new TypeError('length needs to be an integer')

	return function(self) {
		return vec.extend([].slice.call(self, start, start + length))
	}
}

vec.reverse = function() {
	return function(self) {
		return vec.extend([].slice.call(self).reverse())
	}
}

vec.combine = function(fn, other) {
	if(typeof(fn) != 'function') throw new TypeError('fn.vec.combine requires a function')

	if(Array.isArray(other))
		return combine(other)
	else
		return combine

	function combine(other) {
		if(!Array.isArray(other)) other = vec.apply(null, arguments)

		return function(self) {
			if(self.length != other.length)
				throw new Error('Cannot combine vectors of different sizes a: ' + self.length + ', b: ' + other.length)

			return vec.map(function(v, i) {
				return fn(v, other[i], i)
			})(self)
		}
	}
}

vec.add = vec.combine(function(a, b) {
	return a + b
})

vec.sub = vec.combine(function(a, b) {
	return a - b
})

module.exports = vec