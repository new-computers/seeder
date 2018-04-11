const Dat = require('dat-node')
const fs = require('fs')

function Archiver(root, store) {
	try {
		fs.mkdirSync(root + '/archives')
	} catch (e) {}

	this.one = async function(url) {
		dirname = url.replace('dat://', '')
						.replace(/\//g, '')
		try {
			fs.mkdirSync(root + '/archives/' + dirname)
		} catch (e) {}

		Dat(root + '/archives/' + dirname, {key: url}, async (err, dat) => {
			if (err) throw err
			console.log('Added ' + url)

			var network = dat.joinNetwork()
			var stats = dat.trackStats()

			network.on('connection', () => {
				var data = store.get_temp(url) || {}
				data.peers = stats.peers.complete
				store.set_temp(url, data)
			})
		})
	}

	this.all = function() {
		const feeds = store.get('feeds')

		feeds.forEach(this.one)
	}

	return this
}

module.exports = Archiver
