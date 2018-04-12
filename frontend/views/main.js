const html = require('nanohtml')
var css = require('sheetify')

const Input = require('../components/input')
const url = new Input('dat://')

css('../styles/reset.css')
css('../styles/style.css')
module.exports = view

function view (state, emit) {
	var known_url = window.location.origin.replace('http://', '') // location.hostname doesn't include the port
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
					<p>${description(state)}</p>
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
			emit('feeds:cancel', state)
		}
	}

	function addUrl(state) {
		if (state.open) {
			return html`
				<div class="input border">
					${url.render()}
				</div>
			`
		} else {
			return html`
				<div class="entry input border">
					${url.render()}
					<p>some placeholder text</p>
				</div>
			`
		}
	}

	// this is dumb
	function description(state) {
		if (state.feeds.length < 1) {
			return `add a dat url to start peering it →`
		} else if (state.feeds.length == 1 && sum(state.stats) > 1) {
			return `you are seeding ${state.feeds.length} site to ${sum(state.stats)} peers :)`
		} else if (state.feeds.length == 1 && sum(state.stats) == 1) {
			return `you are seeding ${state.feeds.length} site to ${sum(state.stats)} peer :)`
		} else if (state.feeds.length == 1 && sum(state.stats) < 1) {
			return `you are seeding ${state.feeds.length} site to ${sum(state.stats)} peers :)`
		} else if (state.feeds.length > 1 && sum(state.stats) > 1) {
			return `you are seeding ${state.feeds.length} sites to ${sum(state.stats)} peers :)`
		} else if (state.feeds.length > 1 && sum(state.stats) == 1) {
			return `you are seeding ${state.feeds.length} sites to ${sum(state.stats)} peer :)`
		} else if (state.feeds.length > 1 && sum(state.stats) < 1) {
			return `you are seeding ${state.feeds.length} sites to ${sum(state.stats)} peers :)`
		} else {
			return `something is wrong :()`
		}

		function sum( obj ) {
		  var sum = 0;
		  for( var el in obj ) {
		    if( obj.hasOwnProperty( el ) ) {
					if (obj[el].peers) {
			      sum += parseFloat( obj[el].peers );
					}
		    }
		  }
		  return sum;
		}

	}

	function feed(url) {
		return html`
			<div class="pin border">
				<div class="seed">
					<div class=${state.stats[url] ? 'dot green' : 'dot yellow'}></div>
					<a class='url' href="${url}" target="_blank">${url}</a>
				</div>
				<div class="info">
					<div>${state.stats[url] ? state.stats[url].peers : ''}</div>
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
