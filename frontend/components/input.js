const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')

module.exports = class Input extends Nanocomponent {
	constructor(placeholder) {
		super()
		this.placeholder = placeholder
	}

	createElement(val) {
		val = val || ''
		return html`
			<input type="text" placeholder="${this.placeholder}" class="urlInput" value="${val}">
		`
	}

	update(val) {
		return false
	}
}
