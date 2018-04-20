// Maybe this should be a module?
module.exports = function (el, e, handler) {
	try {
		el.removeEventListener(e, handler)
		el.addEventListener(e, handler)
	} catch (err) {
		console.error(err)
	}

	return el
}
