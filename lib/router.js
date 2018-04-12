const Router = require('koa-router')

function r(store, archiver) {
	const router = new Router()

	router.get('/feeds', async (ctx) => {
		var feeds = store.get('feeds')

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {feeds: feeds}
	})

	router.post('/feeds', async (ctx) => {
		var feeds = store.get('feeds')

		feeds.push(ctx.request.body.url)
		archiver.one(ctx.request.body.url)

		store.set('feeds', feeds)
		store.write()

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	router.post('/remove-feed', async (ctx) => {
		var feeds = store.get('feeds')
		feeds.splice(feeds.indexOf(ctx.request.body.url), 1)

		store.set('feeds', feeds)
		store.write()

		archiver.remove(ctx.request.body.url)

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	router.get('/stats/:feed', async (ctx) => {
		var stats = store.get_temp('dat://' + ctx.params.feed)

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {stats: stats}
	})

	return router
}

module.exports = r
