const frp = require('../../frp')
frp.dom   = require('../../frp-dom')

const fn = require('../../fn').inject()
const vec = require('../../vec')

require('domready')(function() {
	const tick = frp.stream()

	const input = frp(
		frp.dom.events.key(document.body)
		// frp.inject(function(e) {
		// 	// console.log(e)
		// })
		// frp.sampleBy(tick)
	)

	const pos = frp(
		input,
		frp.throttle(180),
		frp.map(function(e) {
			if(e.trigger == 'down') {
				switch(e.key) {
				case 'up':
				case 'w':
					return vec(0, -1)

				case 'left':
				case 'a':
					return vec(-1, 0)

				case 'down':
				case 's':
					return vec(0, 1)

				case 'right':
				case 'd':
					return vec(1, 0)
				}
			}
			return vec(0, 0)
		}),
		frp.scan(vec(0, 0), function(pos, offset) {
			return pos.do(vec.add(offset))
		})
	)

	const posEl = document.getElementById('pos')
	pos.watch(function(err, pos) {
		if(err) {
			throw err
		} else {
			console.log(pos)
			posEl.textContent = pos
		}
	})
})