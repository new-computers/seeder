const html = require('nanohtml')
var css = require('sheetify')
const nanoevent = require('../utils/nanoevent')

const Input = require('../components/input')

const url = new Input('dat://')

css('../styles/reset.css')
css('../styles/style.css')
module.exports = view

function view(state, emit) {
	var known_url = window.location.origin.replace('http://', '') // Location.hostname doesn't include the port
	return html`
		<body>
			<header>
				<p>you are known as <a href="http://${known_url}">${known_url}</a></p>
				<div class="configure">
					<a href="https://github.com/new-computers/seeder">feedback ↗</a>
				</div>
			</header>
			<main>
				<div class="add">
					${description(state)}
					${addDatControl(state, emit)}
				</div>
				<div class="">
					${urlInput(state, emit)}
				</div>
				<div class="">
					${state.feeds.map(feed)}
				</div>
			</main>
		</body>
	`
	function addDatControl(state, emit) {
		if (!state.open) {
			return html`
				<p><a href="#" onclick="${submit}" class="">+ add a dat</a></p>
			`
		}
		return html`
				<p><a href="#" onclick="${cancel}" class="cancel">cancel</a>
				<a href="#" onclick="${submit}" class="save">save</a></p>
			`

		function cancel(e) {
			e.preventDefault()
			emit('feeds:cancel', state)
		}
	}

	function adjustSeeding(state, emit) {
		return html`
			<div class="slider">
				<p>seed this site ${state.newUrl.val === 75 ? '' : 'for'} ${state.newUrl.text}</p>
				<input type="range" oninput="${writeVal}" onchange="${writeVal}" min="0" max="75" step="25" value=${state.newUrl.val}>
			</div>
		`

		function writeVal(e) {
			val = e.target.value
			switch (val.toString()) {
				case '75':
					text = 'forever'
					break
				case '50':
					text = '1 month'
					break
				case '25':
					text = '1 week'
					break
				case '0':
					text = '1 day'
					break
				default:
					text = 'whyyy'
			}

			state.newUrl.val = val
			state.newUrl.text = text
			emit('feeds:adjustTime', state)
		}
	}

	function urlInput(state, emit) {
		if (state.open) {
			if (state.opened) {
				setTimeout(() => { // Had to trick this
					url.element.focus()
				}, 100)
				state.opened = false
			}

			return html`
				<div class="input border">
					${nanoevent(url.render(), 'keydown', keydown)}
					${adjustSeeding(state, emit)}
				</div>
			`
		}
		return html`
				<div class="entry input border">
					${nanoevent(url.render(), 'keydown', keydown)}
					<p>some placeholder text</p>
				</div>
			`

		function keydown(e) {
			if (e.keyCode === 13 || e.which === 13) {
				submit(e)
			}
		}
	}

	function submit(e) {
		e.preventDefault()
		emit('feeds:add', url.element.value)
		url.element.value = ''
	}

	function description(state) {
		var s = sum(state.stats)
		console.log(state.stats)
		if (state.feeds.length === 0) {
			return html`<p>add a dat url to start peering it →</p>`
		}
		return html`<p>you are seeding ${state.feeds.length} ${plural('site', state.feeds.length)} to ${s} ${plural('peer', s)} :)</p>`

		function plural(word, value) {
			return word + (value === 1 ? '' : 's')
		}

		function sum(obj) {
			var sum = 0
			for (var el in obj) {
				if (obj.hasOwnProperty(el)) {
					if (obj[el].peers && obj[el].peers !== -1) {
						sum += parseFloat(obj[el].peers)
					}
				}
			}
			return sum
		}
	}

	function feed(fd) {
		var dotcolor = fd.paused ? 'yellow' : 'green'
		var default_peers = '0'
		var error = false

		if (state.stats[fd.url] && state.stats[fd.url].peers === -1) {
			dotcolor = 'red'
			default_peers = ''
			error = true
		}

		return html`
			<div class="pin border">
				<div class="seed">
					<div class="dot ${dotcolor}"></div>
					<a class='url' href="${fd.url}" target="_blank">${fd.url}</a>
				</div>
				<div class="info">
					${!error ? html`<a class='toggle' title="pause or resume seeding" href="#" onclick="${pause}">${!fd.paused ? '=' : '+'}</a>` : ''}
					<a class='remove' title="remove this dat" href="#" onclick="${click}"></a>
					<div>${(!fd.paused && state.stats[fd.url] && !error) ? state.stats[fd.url].peers : default_peers}</div>
				</div>
			</div>
		`

		function click(e) {
			e.preventDefault()
			emit('feeds:remove', fd.url)
		}

		function pause(e) {
			e.preventDefault()
			emit('feeds:pause', fd.url)
		}
	}
}
