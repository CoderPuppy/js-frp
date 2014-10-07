const keymap = exports

for(var i = 0; i < 26; i++) {
	keymap[String.fromCharCode(97 + i)] = 65 + i
}

keymap.left  = 37
keymap.up    = 38
keymap.right = 39
keymap.down  = 40

for(var k in keymap) {
	keymap[keymap[k]] = k
}