const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(express.static('bundles'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.send('hello')
})

app.get('/feeds', function (req, res) {
	var feeds = fs.readFileSync('./feeds', 'utf8')

	feeds = feeds.split('\n').filter((f) => f.length > 0)

	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({feeds: feeds}))
})


app.post('/feeds', function (req, res) {
	var feeds = fs.readFileSync('./feeds', 'utf8')

	feeds += req.body.url + '\n'
	
	fs.writeFileSync('./feeds', feeds)

	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({success: true}))
})

console.log('Server listening...')
app.listen(80)
