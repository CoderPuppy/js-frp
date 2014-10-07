const fn = require('../fn')

const fnArr = exports

fnArr.extend = function(arr) {
	fn.inject(arr)

	return arr
}

fnArr.concat = function(arr) {
	if(typeof(arr) != 'object' || arr === null || typeof(arr.length) != 'number') throw new TypeError('fn.arr.concat requires an Array-like')
	arr = [].slice.call(arr)
	return function(self) {
		return fnArr.extend([].concat.call(self, arr))
	}
}

fnArr.push = function(v) {
	return fnArr.concat([v])
}

fnArr.unshift = function(v) {
	return fn.reverse(fnArr.concat, [v])
}

fnArr.head = function() {
	return function(self) {
		return self[0]
	}
}

fnArr.tail = function() {
	return function(self) {
		return fnArr.extend([].slice.call(self, 1))
	}
}

fnArr.at = function(i) {
	if(typeof(i) != 'number') throw new TypeError('fn.arr.at requires a number')
	return function(self) {
		return self[i]
	}
}

fnArr.set = function(i, v) {
	if(typeof(i) != 'number') throw new TypeError('fn.arr.set requires a number')
	return function(self) {
		const newArr = fnArr.extend([].slice.call(self))
		newArr[i] = v
		return newArr
	}
}

fnArr.map = function(fn) {
	if(typeof(fn) != 'function') throw new TypeError('fn.arr.map requires a function')
	return function(self) {
		const newArr = fnArr.extend([])
		for(var i = 0; i < self.length; i++) {
			newArr.push(fn(self[i], i, self))
		}
		return newArr
	}
}

fnArr.flatMap = function(fn) {
	if(typeof(fn) != 'function') throw new TypeError('fn.arr.flatMap requires a function')
	return function(self) {
		var newArr = []
		for(var i = 0; i < self.length; i++) {
			newArr = newArr.concat(fn(self[i], i, self))
		}
		return fnArr.extend(newArr)
	}
}

fnArr.flatten = function(maxDepth) {
	if(typeof(maxDepth) != 'number') maxDepth = Infinity
	return function(self) {
		const newArr = fnArr.extend([])
		const queue = [ [ 0, [].slice.call(self) ] ]
		while(queue.length > 0) {
			var el = queue.shift()
			var depth = el[0]
			var arr = el[1]
			for(var i = 0; i < arr.length; i++) {
				var el = arr[i]
				if(depth < maxDepth && typeof(el) == 'object' && el && typeof(el.length) == 'number') {
					queue.push([ depth + 1, el ])
					queue.push([ depth, [].slice.call(arr, i + 1) ])
					break
				} else {
					newArr.push(el)
				}
			}
		}
		return newArr
	}
}