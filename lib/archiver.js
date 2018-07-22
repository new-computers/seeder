const Dat = require('dat-node')
const fs = require('fs-extra')
const du = require('du')

function Archiver(root, store) {
	const t = this
	try {
		fs.mkdirSync(root + '/archives')
	} catch (err) {}

	this.dats = {}

	this.one = async function (feed) {
		var url = feed.url

		var dirname = url.replace('dat://', '')
			.replace(/\//g, '')

		try {
			fs.mkdirSync(root + '/archives/' + dirname)
		} catch (err) {}

		Dat(root + '/archives/' + dirname, {key: url}, async (err, dat) => {
			if (err) {
				var data = store.get_temp(dirname)
				data.peers = -1
				store.set_temp(dirname, data)

				throw err
			}

			console.log('Seeding ' + url)
			t.dats[dirname] = dat

			var network = dat.joinNetwork()
			var stats = dat.trackStats()

			network.on('connection', () => {
				var data = store.get_temp(dirname)
				data.peers = stats.peers.total
				store.set_temp(dirname, data)
			})

			du(root + '/archives/' + dirname, (err, size) => {
				var data = store.get_temp(dirname)
				data.size = bytesToSize(size)
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
		if (this.dats[dirname]) {
			this.dats[dirname].pause()
			this.dats[dirname].close()
			delete this.dats[dirname]
		}

		store.delete_temp(dirname)

		try {
			fs.removeSync(root + '/archives/' + dirname)
		} catch (err) {}
	}

	this.pause = function (url) {
		var dirname = url.replace('dat://', '')
			.replace(/\//g, '')
		this.dats[dirname].pause()
	}

	this.resume = function (url) {
		var dirname = url.replace('dat://', '')
			.replace(/\//g, '')
		this.dats[dirname].resume()
	}

	this.all = function () {
		const feeds = store.get('feeds')

		feeds.forEach(this.one)
	}

	return this
}

function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (bytes === 0) {
		return '0 Byte'
	}
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

module.exports = Archiver
