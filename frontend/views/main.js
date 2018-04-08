const html = require('nanohtml')

const Input = require('../components/input')
const url = new Input('dat://')

module.exports = view

function view (state, emit) {
	emit('feeds:fetch')

	return html`
		<body>
			<div>
				${state.feeds.map(feed)}
			</div>
			<div>
				${url.render()}
				<button onclick="${submit}">Add</button>
			</div>
		</body>
	`

	function feed(state) {
		return html`
			<div>
				${state}
			</div>		
		`

	}
	
	function submit (e) {
		e.preventDefault()
		emit('feeds:add', url.element.value)
		url.element.value = ''
	}
}
