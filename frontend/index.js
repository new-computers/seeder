const choo = require('choo')

const app = choo()

app.use((state, emitter) => {
	state.feeds = []
	state.open = false
	fetch()

	emitter.on('feeds:fetch', () => {
		window.fetch('/feeds')
		.then((res) => res.json())
		.then((data) => {
			state.feeds = data.feeds
			emitter.emit('render')
		})
	})

	emitter.on('feeds:cancel', () => {
		console.log('close!')
		state.open = false
		emitter.emit('render')
	})

	emitter.on('feeds:add', (url) => {
		if (!state.open){
			state.open = true
			emitter.emit('render')
		} else {
			if (state.feeds.indexOf(url) != -1) return

			window.fetch('/feeds', {
				body: JSON.stringify({url: url}),
				headers: {
					'content-type': 'application/json'
				},
				method: 'POST'
			})
			.then(res => res.json())
			.then((data) => {
				console.log(url)
				state.feeds.push(url)
				emitter.emit('render')
			})
			console.log('closed')
			state.open = false
		}

	})

	emitter.on('feeds:remove', (url) => {

		window.fetch('/remove-feed', {
			body: JSON.stringify({url: url}),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		})
		.then(res => res.json())
		.then((data) => {
			state.feeds.splice(state.feeds.indexOf(url), 1)
			emitter.emit('render')
		})
	})

	function fetch() {
		window.fetch('/feeds')
		.then((res) => res.json())
		.then((data) => {
			state.feeds = data.feeds
			emitter.emit('render')
		})

	}
})

app.route('/', require('./views/main'))

app.mount('body')
