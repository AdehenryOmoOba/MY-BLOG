// Requirements
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
require('./db')
const express = require('express');
const app = express();
const blogRouter = require('./controllers/blog-control');



// Middlewares
app.use('/public', express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use('/', blogRouter)
app.set('view engine', 'ejs')





// Listening port
app.listen(5000, () => {
    console.log('Server is running on port 5000...')
})