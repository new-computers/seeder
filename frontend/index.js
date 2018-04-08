const choo = require('choo')

const app = choo()

app.use((state, emitter) => {
	state.feeds = []

	emitter.on('feeds:fetch', () => {
		window.fetch('/feeds')
		.then((res) => res.json()) 
		.then((data) => {
			state.feeds = data.feeds
			emitter.emit('render')
		})
	})

	emitter.on('feeds:add', (url) => {
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
			state.feeds.push(url)
			emitter.emit('render')
		})
	})
})

app.route('/', require('./views/main'))

app.mount('body')
