const koa = require('koa')
const http = require('http')
const serve = require('koa-static')
//const vhost = require('koa-vhost')
const Switch = require('koa-switch-vhost');
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const Store = require('./lib/store')
const router = require('./lib/router')
const Archiver = require('./lib/archiver')

const app = new koa()

var port = 80
var root = '/home/pi/seeder'
var dev = false

if (process.argv.length > 2 && process.argv[2] === 'dev') {
	port = 8080
	root = '.'
	dev = true
}

const store = new Store(root + '/data.json')
const archiver = new Archiver(root, store)
const r = router(store, archiver)

store.read()
archiver.all()

const vhost = new Switch();

var sites = store.get('feeds')
for (var i = 0; i < sites.length; i++) {
	if (sites[i].http) {
		vhost.use({
			host: sites[i].http,
			app: create_site_app(sites[i])
		})
	}
}

app.use(bodyParser())
app.use(r.routes()).use(r.allowedMethods())
app.use(vhost.switch())
app.use(serve(root + '/bundles'))

var server
if (!dev) {
	// TODO: lets encrypt
} else {
	server = http.createServer(app.callback())
	server.listen(port)
}
server.once('listening', function() {
	console.log('The frontend is served on port ' + port + '.\n')
})

function create_site_app(site) {
	var sapp = new koa()

	var router = new Router()
	router.get('/.well-known/dat', function(ctx) {
		ctx.body = site.url
	})

	var dirname = site.url.replace('dat://', '').replace(/\//g, '')

	sapp.use(serve(root + '/archives/' + dirname, {extensions: ['html']}))
	sapp.use(router.routes()).use(router.allowedMethods())

	return sapp
}


// Timeout for seeded sites
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
