const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

var port = 80
var root = '/home/pi/seeder'

if (process.argv.length > 2 && process.argv[2] == 'dev') {
	port = 8080
	root = '.'
}

app.use(express.static(root + '/bundles'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/feeds', function (req, res) {
	var feeds = read()

	feeds = feeds.split('\n').filter((f) => f.length > 0)

	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({feeds: feeds}))
})


app.post('/feeds', function (req, res) {
	var feeds = read()

	feeds += req.body.url + '\n'

	fs.writeFileSync(root + '/feeds', feeds)

	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({success: true}))
})

app.post('/remove-feed', function (req, res) {
	var feeds = read()

	feeds = feeds.split('\n').filter(f => f.length > 0)
	feeds.splice(feeds.indexOf(req.body.url), 1)

	var r = ''
	for (var i = 0; i < feeds.length; i++) {
		r += feeds[i] + '\n'
	}

	fs.writeFileSync(root + '/feeds', r)

	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({success: true}))
})

function read() {
	var feeds = ''

	try {
		feeds = fs.readFileSync(root + '/feeds', 'utf8')
	} catch (e) {}

	return feeds
}

console.log('Server listening on port ' + port + '...')
app.listen(port)
