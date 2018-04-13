const parse = require('parse-dat-url')

module.exports = (state, emitter) => {
	state.feeds = []
	state.stats = {}
	state.open = false
	fetch()

	emitter.on('feeds:fetch', fetch)

	emitter.on('feeds:cancel', () => {
		state.open = false
		emitter.emit('render')
	})

	emitter.on('feeds:add', (url) => {
		if (!state.open){
			state.open = true
			emitter.emit('render')
		} else {
			try {
				url = parse(url)

				if (url.protocol != 'dat:') return

				if (state.feeds.indexOf(url.href) != -1) return

				window.fetch('/feeds', {
					body: JSON.stringify({url: url.href}),
					headers: {
						'content-type': 'application/json'
					},
					method: 'POST'
				})
				.then(res => res.json())
				.then((data) => {
					state.feeds.push(url.href)
					emitter.emit('render')
					stats(url.href)
				})
				state.open = false
			} catch (e) {
				console.error(e)
			}
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
			delete state.stats[url]
			emitter.emit('render')
		})
	})

	emitter.on('feeds:stats', stats)

	function fetch() {
		window.fetch('/feeds')
		.then((res) => res.json())
		.then((data) => {
			state.feeds = data.feeds
			emitter.emit('render')

			state.feeds.forEach((f) => {
				stats(f)
			})
		})
	}

	function stats(url) {
		var dirname = url.replace('dat://', '').replace(/\//g, '')

		window.fetch('/stats/' + dirname)
		.then(res => res.json())
		.then((data) => {
			state.stats[url] = data.stats
			emitter.emit('render')

			// recheck after 10 seconds
			setTimeout(() => {
				stats(url)
			}, 10000)
		})
	}
}
