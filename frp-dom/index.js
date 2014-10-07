const bean = require('bean')
const frp  = require('../frp')

const dom = exports

const keymap = dom.keymap = require('./keymap')

dom.events = (function() {
	const events = {}

	events.key = function(el) {
		const res = frp.stream()

		function createEvent(rawEv) {
			const keyCode = rawEv.which || rawEv.keyCode
			const e = {
				type: 'key',
				key: keymap[keyCode],
				keyCode: keyCode,

				// modifiers
				alt: !!rawEv.altKey,
				ctrl: !!rawEv.ctrlKey,
				meta: !!rawEv.metaKey,
				shift: !!rawEv.shiftKey
			}
			return e
		}

		bean.on(el, 'keypress', function(rawEv) {
			const e = createEvent(rawEv)
			e.trigger = 'press'
			res.emit(e)
		})

		bean.on(el, 'keydown', function(rawEv) {
			const e = createEvent(rawEv)
			e.trigger = 'down'
			res.emit(e)
		})

		bean.on(el, 'keyup', function(rawEv) {
			const e = createEvent(rawEv)
			e.trigger = 'up'
			res.emit(e)
		})

		return res
	}

	events.click = function(el) {
		const out = frp.stream()

		const buttonMap = {
			0: 'left',
			1: 'middle',
			2: 'right'
		}

		function createEvent(rawEv) {
			const e = {
				button: buttonMap[rawEv.button],
				x: rawEv.clientX,
				y: rawEv.clientY,

				// modifiers
				alt: !!rawEv.altKey,
				ctrl: !!rawEv.ctrlKey,
				meta: !!rawEv.metaKey,
				shift: !!rawEv.shiftKey
			}
			return e
		}

		bean.on(el, 'click', function(rawEv) {
			const e = createEvent(rawEv)
			out.emit(e)
		})

		return out
	}

	return events
})()