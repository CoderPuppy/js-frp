const fn = require('../fn')

const fnObj = exports

fnObj.extend = function(obj) {
	fn.inject(obj)

	return obj
}

// TODO: merge, deep merge, get, set

fnObj.map = function(fn) {
	if(typeof(fn) != 'function') throw new TypeError('fn.obj.map requires a function')
	return function(self) {
		const newObj = Object.create(Object.getPrototypeOf(self))
		for(var k in self) {
			if(!{}.hasOwnProperty.call(self, k)) continue
			// TODO: should this pass [k, v] or v, k or k, v
			var kv = fn(k, self[k])
			newObj[kv[0]] = kv[1]
		}
		return newObj
	}
}

fnObj.mapKeys = function(fn) {
	if(typeof(fn) != 'function') throw new TypeError('fn.obj.mapKeys requires a function')
	return fnObj.map(function(k, v) {
		return [ fn(k), v ]
	})
}

fnObj.mapValues = function(fn) {
	if(typeof(fn) != 'function') throw new TypeError('fn.obj.mapValues requires a function')
	return fnObj.map(function(k, v) {
		return [ k, fn(v) ]
	})
}

fnObj.reverse = function() {
	return fnObj.map(function(k, v) {
		return [ v, k ]
	})
}