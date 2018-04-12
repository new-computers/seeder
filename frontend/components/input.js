const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')

module.exports = class Input extends Nanocomponent {
	constructor(placeholder) {
		super()
		this.placeholder = placeholder
	}

	createElement() {
		return html`
			<input type="text" onkeyup='${this.fire}' placeholder="${this.placeholder}" class="">
		`
	}

	update() {
		return false
	}

	fire(e) {
		e.preventDefault()
		var keypressed = e.keyCode || event.which;
		if (keypressed == 13) {
			// I want to emit an update here so we can hit enter to submit the new url
			// this.emit('feeds:add', e.target.value)
		}
	}
}
