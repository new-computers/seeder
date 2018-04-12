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
				stats(url)
			})
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
				stats(url, t + 1)
			}, 10000)
		})
	}
}
