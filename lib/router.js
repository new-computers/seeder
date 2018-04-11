const Router = require('koa-router')

function r(store, archiver) {
	const router = new Router()

	router.get('/feeds', async (ctx, next) => {
		var feeds = store.get('feeds')

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {feeds: feeds}
	})

	router.post('/feeds', async (ctx, next) => {
		var feeds = store.get('feeds')

		feeds.push(ctx.request.body.url)

		store.set('feeds', feeds)
		store.write()

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	router.post('/remove-feed', async (ctx, next) => {
		var feeds = store.get('feeds')
		feeds.splice(feeds.indexOf(ctx.request.body.url), 1)

		store.set('feeds', feeds)
		store.write()

		ctx.response.set('Content-Type', 'application/json')
		ctx.body = {success: true}
	})

	return router
}

module.exports = r
