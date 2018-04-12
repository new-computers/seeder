const html = require('nanohtml')
var css = require('sheetify')

const Input = require('../components/input')
const url = new Input('dat://')

var prefix = css('../styles/style.css')
module.exports = view

function view (state, emit) {
	var known_url = window.location.origin.replace('http://', '') // location.hostname doesn't include the port
	return html`
		<body class=${prefix}>
			<header>
				<p>you are known as <a href="http://${known_url}">${known_url}</a></p>
				<p>set up http access</p>
			</header>
			<main>
				<div class="add">
					<p>when this pi is connected to a network it will help peer this site</p>
					${addLink(state)}
				</div>
				<div class="">${addUrl(state)}</div>
				<div class="">
					${state.feeds.map(feed)}
				</div>
			</main>
		</body>
	`
	function addLink(state) {
		if (!state.open){
			return html`
				<p><a href="#" onclick="${submit}" class="">+ add a dat</a></p>
			`
		} else {
			return html`
				<p><a href="#" onclick="${cancel}" class="cancel">cancel</a>
				<a href="#" onclick="${submit}" class="save">save</a></p>
			`
		}

		function submit (e) {
			e.preventDefault()
			emit('feeds:add', url.element.value)
			url.element.value = ''
		}

		function cancel (e) {
			e.preventDefault()
			console.log('cancel')
			emit('feeds:cancel', state)
		}
	}

	function addUrl(state) {
		if (state.open) {
			return html`
				<div class="input">
					${url.render()}
				</div>
			`
		} else {
			return html`
				<div class="entry input">
					${url.render()}
					<p>some placeholder text</p>
				</div>
			`
		}
	}

	function feed(url) {
		return html`
			<div class="pin">
				<div class="seed">
					<p class='url'>
						<a href="${url}" target="_blank">${url}</a>
					</p>
				</div>
				<div class="info">
					<div>${state.stats[url] ? state.stats[url].peers : ''}</div>
					<div class="dot"></div>
					<a class='remove' href="#" onclick="${click}"></a>
				</div>
			</div>
		`

		function click(e) {
			e.preventDefault()

			emit('feeds:remove', url)
		}

	}
}
