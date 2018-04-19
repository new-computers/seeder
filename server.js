const koa = require('koa')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')

const Store = require('./lib/store')
const router = require('./lib/router')
const Archiver = require('./lib/archiver')

const app = new koa()

var port = 80
var root = '/home/pi/seeder'

if (process.argv.length > 2 && process.argv[2] === 'dev') {
	port = 8080
	root = '.'
}

const store = new Store(root + '/data.json')
const archiver = new Archiver(root, store)
const r = router(store, archiver)

store.read()
archiver.all()

app.use(serve(root + '/bundles'))
app.use(bodyParser())
app.use(r.routes())
	.use(r.allowedMethods())

console.log('Server listening on port ' + port + '...')
app.listen(port)

// timeout for seeded sites
check_timeouts()
setInterval(check_timeouts, 2 * 3600000)

function check_timeouts() {
	var now = new Date().getTime()

	var feeds = store.get('feeds')

	for (var i = 0; i < feeds.length; i++) {
		if (feeds[i].timeout && feeds[i].timeout < now) {
			archiver.remove(feeds[i].url)

			feeds.splice(store.indexOf(feeds[i].url), 1)
		}
	}

	store.set('feeds', feeds)
	store.write()
}
