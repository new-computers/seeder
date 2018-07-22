const Router = require('koa-router')

function r(store, archiver) {
	const router = new Router()

	router.get('/feeds', async ctx => {
		var feeds = store.get('feeds')
		var letsencrypt = store.get('letsencrypt')

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {feeds, letsencrypt}
	})

	router.post('/feeds', async ctx => {
		var feeds = store.get('feeds')

		var obj = {
			url: ctx.request.body.url,
			paused: false
		}

		if (ctx.request.body.timeout) {
			obj.timeout = ctx.request.body.timeout
		}

		feeds.push(obj)
		archiver.one(obj)

		store.set('feeds', feeds)
		store.write()

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	router.post('/remove-feed', async ctx => {
		var feeds = store.get('feeds')
		feeds.splice(store.indexOf(ctx.request.body.url), 1)

		store.set('feeds', feeds)
		store.write()

		archiver.remove(ctx.request.body.url)

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	router.get('/stats/:feed', async ctx => {
		var stats = store.get_temp(ctx.params.feed)

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = JSON.stringify(stats)
	})

	router.post('/pause', async ctx => {
		var feeds = store.get('feeds')
		var id = store.indexOf(ctx.request.body.url)

		if (feeds[id].paused) {
			archiver.resume(ctx.request.body.url)
		} else {
			archiver.pause(ctx.request.body.url)
		}

		feeds[id].paused = !feeds[id].paused

		store.set('feeds', feeds)
		store.write()

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	router.post('/mirror', async ctx => {
		var feeds = store.get('feeds')
		var id = store.indexOf(ctx.request.body.url)

		feeds[id].http = ctx.request.body.http

		store.set('feeds', feeds)
		store.write()

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	router.post('/letsencrypt', async ctx => {
		store.set('letsencrypt', ctx.request.body.res)
		store.write()

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	// Currently not used, but left it here in case it'll be needed
	router.post('/timeout', async ctx => {
		var feeds = store.get('feeds')
		var id = store.indexOf(ctx.request.body.url)

		feeds[id].timeout = ctx.request.body.timeout

		store.set('feeds', feeds)
		store.write()

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	return router
}

module.exports = r
