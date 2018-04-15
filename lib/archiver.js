const Dat = require('dat-node')
const fs = require('fs-extra')

function Archiver(root, store) {
	const t = this
	try {
		fs.mkdirSync(root + '/archives')
	} catch (e) {}

	this.dats = {}

	this.one = async function (feed) {
		var url = feed.url

		var dirname = url.replace('dat://', '')
			.replace(/\//g, '')
		try {
			fs.mkdirSync(root + '/archives/' + dirname)
		} catch (e) {}

		Dat(root + '/archives/' + dirname, {key: url}, async (err, dat) => {
			if (err) {
				throw err
			}
			console.log('Added ' + url)
			t.dats[dirname] = dat

			var network = dat.joinNetwork()
			var stats = dat.trackStats()

			network.on('connection', () => {
				var data = store.get_temp(url)
				data.peers = stats.peers.complete
				store.set_temp(dirname, data)
			})

			if (feed.paused) {
				dat.pause()
			}
		})
	}

	this.remove = async function (url) {
		var dirname = url.replace('dat://', '')
			.replace(/\//g, '')
		console.log('Removed ' + url)
		this.dats[dirname].close()

		try {
			fs.removeSync(root + '/archives/' + dirname)
		} catch (e) {}
	}

	this.pause = function (url) {
		this.dats[url].pause()
	}

	this.resume = function (url) {
		this.dats[url].resume()
	}

	this.all = function () {
		const feeds = store.get('feeds')

		feeds.forEach(this.one)
	}

	return this
}

module.exports = Archiver
