const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const category = require('./models/category')

const categories = require('./controllers/categories')
const products = require('./controllers/products')
const home = require('./controllers/home')

const db = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'masterkey',
        database: 'devshop'
    }
})

db.on('query', query => {
    console.log('SQL: ', query.sql)
})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(async (req, res, next) => {
    const categories = await category.getCategories(db)()
    res.locals = {
        categories
    }
    next()
})

app.get('/', home.getIndex)
app.get('/categories/:id/:slug', categories.getCategory(db))
app.get('/products/:id/:slug', products.getProduct(db))

app.listen(port, err => {
    if (err) {
        console.log('err', err)
    } else {
        console.log('DevShop listening in port ' + port)
    }
})
