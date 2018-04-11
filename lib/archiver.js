/*

Dat(root + '/test', {key: feeds[0]}, async (err, dat) => {
	if (err) throw err

	var network = dat.joinNetwork()

	var peers = 0

	network.on('connection', () => {
		peers = network.connected
		console.log(peers)
	})
})

*/

const fs = require('fs')

function Archiver(root, store) {
	try {
		fs.mkdirSync(root + '/archives')
	} catch (e) {}

	this.update = function() {
		const feeds = store.get('feeds')

		feeds.forEach(async function (url) {
			
		})
	}

	return this
}

module.exports = Archiver
