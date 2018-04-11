const fs = require('fs')

function Store(path) {
	this.data = {
		feeds: []
	}

	this.get = function(key) {
		return this.data[key]
	}

	this.set = function(key, value) {
		this.data[key] = value
		return value
	}

	this.read = function() {
		try {
			data = fs.readFileSync(path, 'utf8')
			this.data = JSON.parse(data)
		} catch (e) {}
	}

	this.write = function() {
		fs.writeFile(path, JSON.stringify(this.data, null, '\t'), err => {
			if (err) throw err
		})
	}

	return this
}

module.exports = Store
