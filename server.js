const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(express.static('/home/pi/seeder/bundles'))
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
	
	fs.writeFileSync('/home/pi/seeder/feeds', feeds)

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

	fs.writeFileSync('/home/pi/seeder/feeds', r)

	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({success: true}))
})

function read() {
	var feeds = ''

	try {
		feeds = fs.readFileSync('/home/pi/seeder/feeds', 'utf8')
	} catch (e) {}

	return feeds
}

console.log('Server listening...')
app.listen(80)
