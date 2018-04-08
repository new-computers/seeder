const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')

module.exports = class Input extends Nanocomponent {
	constructor(placeholder) {
		super()

		this.placeholder = placeholder
	}

	createElement() {
		return html`
			<input type="text" placeholder="${this.placeholder}">
		`
	}

	update() {
		return false
	}
}
