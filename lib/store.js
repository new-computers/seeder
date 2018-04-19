const fs = require('fs')

function Store(path) {
	this.data = {
		feeds: []
	}

	this.temp = {}

	this.get = function (key) {
		return this.data[key]
	}

	this.set = function (key, value) {
		this.data[key] = value
		return value
	}

	this.indexOf = function (url) {
		for (var i = 0 ; i < this.data.feeds.length; i++) {
			if (this.data.feeds[i].url === url) {
				return i
			}
		}
	}

	this.get_temp = function (key) {
		return this.temp[key] || {}
	}

	this.set_temp = function (key, value) {
		this.temp[key] = value
	}

	this.read = function () {
		try {
			var data = fs.readFileSync(path, 'utf8')
			data = JSON.parse(data)

			this.data = {
				feeds: []
			}
			for (var i = 0; i < data.feeds.length; i++) {
				if (typeof data.feeds[i] === 'object') {
					this.data.feeds.push(data.feeds[i])
				} else {
					this.data.feeds.push({
						url: data.feeds[i],
						paused: false
					})
				}
			}
		} catch (e) {}
	}

	this.write = function () {
		fs.writeFile(path, JSON.stringify(this.data, null, '\t'), err => {
			if (err) {
				throw err
			}
		})
	}

	return this
}

module.exports = Store
