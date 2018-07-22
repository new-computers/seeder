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
		for (var i = 0; i < this.data.feeds.length; i++) {
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

	this.delete_temp = function(key) {
		delete this.temp[key]
	}

	this.read = function () {
		try {
			var data = fs.readFileSync(path, 'utf8')
			data = JSON.parse(data)

			this.data = {
				feeds: [],
				letsencrypt: data.letsencrypt
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
		} catch (err) {}
	}

	this.write = function () {
		fs.writeFile(path, JSON.stringify(this.data, null, '\t'), err => {
			if (err) {
				throw err
			}
		})
	}

	var t = this

	this.approveDomains = function() {
		var domains = []
		for (var i = 0; i < t.data.feeds.length; i++) {
			if (t.data.feeds[i].http) domains.push(t.data.feeds[i].http)
		}

		return function (options, certs, cb) {
		    var domain = options.domain
		    options.agreeTos = true
		    options.email = t.data.letsencrypt.email
		    if (certs) {
		      options.domains = certs.altnames
		    }

		    // is this one of our sites?
		    if (domains.indexOf(domain) !== -1) {
		      return cb(null, {options: options, certs: certs})
		    }

		    cb(new Error('Invalid domain'))
		}


	}

	return this
}

module.exports = Store
