const html = require('nanohtml')

const Input = require('../components/input')
const url = new Input('dat://')

module.exports = view

function view (state, emit) {
	return html`
		<body class="db 1 p2 fl">
			<div class="2/3 m-1 db mxa">
				${url.render()}
				<a href="#" onclick="${submit}" class="my1">Add</a>
			</div>
			<div class="2/3 m-1 db mxa">
				${state.feeds.map(feed)}
			</div>
		</body>
	`

	function feed(state) {
		return html`
			<div class="1 p0-5 tac">
				<a href="${state}" target="_blank">${state}</a> [<a href="#" onclick="${click}">remove</a>]
			</div>		
		`

		function click(e) {
			e.preventDefault()

			emit('feeds:remove', state)
		}

	}
	
	function submit (e) {
		e.preventDefault()
		emit('feeds:add', url.element.value)
		url.element.value = ''
	}
}
