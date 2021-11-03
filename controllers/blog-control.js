const express = require('express');
const router = express.Router()
const BlogModel = require('../models/blog-model')


// Routes
router.get('/', async (req, res) => {
     
    const allBlogs = await BlogModel.find({});
    
    res.render('index', {blogs: allBlogs})
})

router.get('/compose', (req, res) => {

    

    res.render('composeBlog')
})

router.post('/compose', async (req, res) => {
    const {title, content} = req.body;
    console.log(title | content);

    try {
        if (!title || !content){
            res.send('Please provide Title and/or Content...')
        }

        const newBlog = new BlogModel({title, content})

        newBlog.save();

        res.redirect('/')

        console.log('Blog Posted Successfully')

    } catch (error) {
        console.log(error)
        res.render('composeBlog')
    }

    


  
})


module.exports = router;