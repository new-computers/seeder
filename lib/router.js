const Router = require('koa-router')

function r(store, archiver) {
	const router = new Router()

	router.get('/feeds', async ctx => {
		var feeds = store.get('feeds')

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {feeds}
	})

	router.post('/feeds', async ctx => {
		var feeds = store.get('feeds')

		var obj = {
			url: ctx.request.body.url,
			paused: false
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
		ctx.body = {stats}
	})

	router.post('/pause', async ctx => {
		var feeds = store.get('feeds')

		if (typeof feeds[ctx.request.body.url] !== 'object') {
			feeds[ctx.request.body.url] = {
				url: feed,
				paused: true
			}
		} else {
			feed.paused = true
		}

		store.set
	})

	return router
}

module.exports = r
