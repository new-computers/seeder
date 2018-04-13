// maybe this should be a module?
module.exports = function (el, e, handler) {
	try {
		el.removeEventListener(e, handler)
		el.addEventListener(e, handler)
	} catch (e) {
		console.error(e)
	}

	return el
}
