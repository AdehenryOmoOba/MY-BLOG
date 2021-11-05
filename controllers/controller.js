const express            = require('express');
const router             = express.Router();
const BlogModel          = require('../models/blog-model')
const AdminModel         = require('../models/admin-model')
const LocalStrategy      = require('passport-local');
const passport           = require('passport')
const bcrypt             = require('bcrypt');





const isLoggedIn = (req, res, next) =>  {
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/')
    }
}

const isLoggedOut  = (req, res, next) => {
  if (!req.isAuthenticated()){
      return next()
  } else {
      res.redirect('/admin')
  }
}



// Routes

// Get Admin Login Page
router.get('/admin', (req, res) => {    
     
    res.render('admin')
})

// Admin Login

router.post('/admin', passport.authenticate('local', {successRedirect: '/admin-index', failureRedirect: "/admin"}))

// Admin Sign Up
router.post('/admin/sign-up' , async (req, res) => {
    const {username, email, password} = req.body;


     try {

         if (!email || !username || !password){
          return   res.send(`<h2>Sign Up fail!...One of Email, Username or Password is missing.</h2>`)
         }

         const hashedPassword = await bcrypt.hash(password, 10)

         const newAdmin = new AdminModel();

         newAdmin.username = username;
         newAdmin.email = email;
         newAdmin.password = hashedPassword;

         console.log(username , email , hashedPassword)

         newAdmin.save();

         res.redirect('/admin')

     } catch (error) {
         console.log(error)
         res.redirect('/admin/sign-up')
     }

})

// Admin Index page
router.get('/admin-index', isLoggedIn , async (req, res) => {    
     
    const allBlogs = await BlogModel.find({});

    res.render('admin-index', {blogs: allBlogs})
})

router.get('/admin-oneblog/:id', isLoggedIn , async (req, res) => {

    const {id} = req.params;
     
    const blog = await BlogModel.findOne({_id: id});

    res.render('admin-oneBlog', {oneBlog: blog})
})

// Get Admin Sign Up page
router.get('/admin/sign-up', isLoggedIn , (req, res) => {
     
    res.render('admin-register')
})

//Admin Sign Out
router.get('/sign-out', (req, res) => {
      req.logOut();
      res.redirect('/admin')
})

// Read all blogs
router.get('/', async (req, res) => {
     
    const allBlogs = await BlogModel.find({});
    
    res.render('index', {blogs: allBlogs})
})

// Compose New blog
router.get('/compose' , isLoggedIn, (req, res) => {
    res.render('composeBlog')
})

// Add New blog
router.post('/compose', isLoggedIn , async (req, res) => {
    const {title, content} = req.body;
    console.log(title | content);

    try {
        if (!title || !content){
            res.send('Please provide Title and/or Content...')
        }

        const newBlog =  new BlogModel({title, content})

        newBlog.save();

        res.redirect('/admin-index')

        console.log('Blog Posted Successfully')

    } catch (error) {
        console.log(error)
        res.render('composeBlog')
    }

    


  
})

// view a single blog
router.get('/blog/:id', async (req, res) => {
  const {id} = req.params;
  
  const blog = await BlogModel.findOne({_id: id});

  res.render('oneBlog', {oneBlog: blog})

})

// Delete a blog
router.get('/delete/:id', isLoggedIn , async (req, res) => {
    const {id} = req.params;

    await BlogModel.deleteOne({_id: id});

    console.log('Blog deleted successfully')

    res.redirect('/admin-index')
})

// Edit a blog
router.get('/update/:id', isLoggedIn , async (req, res) => {
    const {id} = req.params;
   
    const updateBlog = await BlogModel.findOne({_id: id})

    res.render('update', {update: updateBlog})
})

// Update changes to a blog
router.post('/update/:id', isLoggedIn , async (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;
   
    await BlogModel.updateOne({_id: id}, {title, content})

    res.redirect('/admin-index')
})



module.exports = router;