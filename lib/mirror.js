const http = require('http')
const koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const vhost = require('koa-vhost')

module.exports = function (config, cb) {

	const app = new koa()

	for (var i = 0; i < config.sites.length; i++) {
		if (config.sites[i].http) {
			app.use(vhost(config.sites[i].http, create_site_app(config.sites[i])))
		}
	}

	const server = http.createServer(app)
	server.listen(config.port)

	if (cb) {
		server.once('listening', cb)
	}

	function create_site_app(site) {
		var sapp = new koa()

		var router = new Router()
		router.get('/.well-known/dat', function(ctx) {
			ctx.body = site.url
		})

		var dirname = site.url.replace('dat://', '')
			.replace(/\//g, '')

		sapp.use(router.routes())
		sapp.use(serve(config.root + '/archives/' + dirname))

		return sapp
	}

	const res = {}
	return res
}
