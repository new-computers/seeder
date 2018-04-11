const koa = require('koa')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')

const fs = require('fs')

const app = new koa()

var port = 80
var root = '/home/pi/seeder'

if (process.argv.length > 2 && process.argv[2] == 'dev') {
	port = 8080
	root = '.'
}

app.use(serve(root + '/bundles'))
app.use(bodyParser())

const router = new Router()

router.get('/feeds', async (ctx, next) => {
	var feeds = read()

	feeds = feeds.split('\n').filter((f) => f.length > 0)

	ctx.response.set('Content-Type', 'application/json')
	ctx.body = {feeds: feeds}
})

router.post('/feeds', async (ctx, next) => {
	var feeds = read()

	feeds += ctx.request.body.url + '\n'

	fs.writeFileSync(root + '/feeds', feeds)

	ctx.response.set('Content-Type', 'application/json')
	ctx.body = {success: true}
})

router.post('/remove-feed', async (ctx, next) => {
	var feeds = read()

	feeds = feeds.split('\n').filter(f => f.length > 0)
	feeds.splice(feeds.indexOf(ctx.request.body.url), 1)

	var r = ''
	for (var i = 0; i < feeds.length; i++) {
		r += feeds[i] + '\n'
	}

	fs.writeFileSync(root + '/feeds', r)

	ctx.response.set('Content-Type', 'application/json')
	ctx.body = {success: true}
})

app.use(router.routes())
	.use(router.allowedMethods())

function read() {
	var feeds = ''

	try {
		feeds = fs.readFileSync(root + '/feeds', 'utf8')
	} catch (e) {}

	return feeds
}

console.log('Server listening on port ' + port + '...')
app.listen(port)
