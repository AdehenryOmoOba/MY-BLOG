const express = require('express');
const router = express.Router()
const BlogModel = require('../models/blog-model')


// Routes
router.get('/', (req, res) => {
    res.render('index')
})

router.get('/compose', (req, res) => {
    res.render('composeBlog')
})


module.exports = router;