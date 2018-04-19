const parse = require('parse-dat-url')
const moment = require('moment')

module.exports = (state, emitter) => {
	state.feeds = []
	state.stats = {}
	// state.open = true
	state.newUrl = {val: 75, text: "forever"}
	fetch()

	emitter.on('feeds:fetch', fetch)

	emitter.on('feeds:cancel', () => {
		state.open = false
		emitter.emit('render')
	})

	emitter.on('feeds:adjustTime',  () => {
		// state.open = true
		// state.text = text
		emitter.emit('render')
	})

	emitter.on('feeds:add', url => {
		if (!state.open) {
			state.open = true
			state.opened = true // true only at the first render after open
			emitter.emit('render')
		} else {
			try {
				url = parse(url)

				if (url.protocol !== 'dat:') return

				if (state.feeds.indexOf(url.href) !== -1) return

				var data = {
					url: url.href
				}

				switch (state.newUrl.val.toString()) {
					case "50":
						data.timeout = moment().add(1, 'M').valueOf()
						break;
					case "25":
						data.timeout = moment().add(1, 'w').valueOf()
						text = "1 week"
						break;
					case "0":
						data.timeout = moment().add(1, 'd').valueOf()
						text = "1 day"
						break;
				}

				window.fetch('/feeds', {
					body: JSON.stringify(data),
					headers: {
						'content-type': 'application/json'
					},
					method: 'POST'
				})
					.then(res => res.json())
					.then(data => {
						if (data.success) {
							state.newUrl = {val: 75, text: "forever"} // reset

							state.feeds.push({url: url.href})
							emitter.emit('render')
							stats(url.href)
						}
					})
				state.open = false
			} catch (e) {
				console.error(e)
			}
		}
	})

	emitter.on('feeds:remove', url => {
		window.fetch('/remove-feed', {
			body: JSON.stringify({url: url}),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					state.feeds.splice(index(url), 1)
					delete state.stats[url]
					emitter.emit('render')
				}
			})
	})

	emitter.on('feeds:stats', stats)

	emitter.on('feeds:pause', url => {
		window.fetch('/pause', {
			body: JSON.stringify({url: url}),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					state.feeds[index(url)].paused = !state.feeds[index(url)].paused
					emitter.emit('render')
				}
			})
	})

	function fetch() {
		window.fetch('/feeds')
			.then(res => res.json())
			.then(data => {
				state.feeds = data.feeds
				emitter.emit('render')

				state.feeds.forEach(f => {
					stats(f.url)
				})
			})
	}

	function stats(url) {
		var dirname = url.replace('dat://', '').replace(/\//g, '')

		window.fetch('/stats/' + dirname)
			.then(res => res.json())
			.then(data => {
				state.stats[url] = data
				emitter.emit('render')

				// Recheck after 10 seconds
				setTimeout(() => {
					stats(url)
				}, 10000)
			})
	}

	function index(url) {
		for (var i = 0; i < state.feeds.length; i++) {
			if (state.feeds[i].url == url) return i
		}
	}
}
