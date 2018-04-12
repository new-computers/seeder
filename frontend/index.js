const choo = require('choo')

const app = choo()

app.use(require('./plugins/seeder'))

app.route('/', require('./views/main'))

app.mount('body')
