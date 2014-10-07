const frp = require('../../frp')
frp.dom   = require('../../frp-dom')

const fn = require('../../fn').inject()
const vec = require('../../vec')

const $ = document.getElementById.bind(document)

require('domready')(function() {
	const up = frp(
		frp.dom.events.click($('up')),
		frp.map(function() { return 1 })
	)
	const down = frp(
		frp.dom.events.click($('down')),
		frp.map(function() { return -1 })
	)

	const countEl = $('count')
	frp(
		frp.merge(up, down),
		frp.scan(0, function(acc, val) {
			return acc + val
		})
	).watch(function(err, count) {
		if(err)
			throw err
		else
			countEl.textContent = count
	})
})