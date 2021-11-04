// const express       = require('express');
// const router        = express.Router()
// const BlogModel     = require('../models/blog-model')
// const AdminModel    = require('../models/admin-model')
// const bcrypt        = require('bcrypt');
// const passport      = require('passport')
// const LocalStrategy = require('passport-local');
// const session       = require('express-session')



// // Routes

// // Get Admin Login Page
// router.get('/admin', (req, res) => {    
     
//     res.render('admin')
// })

// // Admin Login


// router.post('/admin', passport.authenticate('local', {successRedirect: "/admin-index", failureRedirect: "/admin"}))

// // Get Admin Sign Up page
// router.get('/admin/sign-up', (req, res) => {
     
//     res.render('admin-register')
// })

// // Admin Sign Up
// router.post('/admin/sign-up', async (req, res) => {
//     const {username, email, password} = req.body;


//      try {

//          if (!email || !username || !password){
//           return   res.send(`<h2>Sign Up fail!...One of Email, Username or Password is missing.</h2>`)
//          }

//          const hashedPassword = await bcrypt.hash(password, 10)

//          const newAdmin = new AdminModel();

//          newAdmin.username = username;
//          newAdmin.email = email;
//          newAdmin.password = hashedPassword;

//          console.log(username , email , hashedPassword)

//          newAdmin.save();

//          res.redirect('/admin')

//      } catch (error) {
//          console.log(error)
//          res.redirect('/admin/sign-up')
//      }

// })


// // Read all blogs
// router.get('/', async (req, res) => {
     
//     const allBlogs = await BlogModel.find({});
    
//     res.render('index', {blogs: allBlogs})
// })

// // Compose New blog
// router.get('/compose', (req, res) => {
//     res.render('composeBlog')
// })

// // Create New blog
// router.post('/compose', async (req, res) => {
//     const {title, content} = req.body;
//     console.log(title | content);

//     try {
//         if (!title || !content){
//             res.send('Please provide Title and/or Content...')
//         }

//         const newBlog =  new BlogModel({title, content})

//         newBlog.save();

//         res.redirect('/')

//         console.log('Blog Posted Successfully')

//     } catch (error) {
//         console.log(error)
//         res.render('composeBlog')
//     }

    


  
// })

// // view a single blog
// router.get('/blog/:id', async (req, res) => {
//   const {id} = req.params;
  
//   const blog = await BlogModel.findOne({_id: id});

//   res.render('oneBlog', {oneBlog: blog})

// })

// // Delete a blog
// router.get('/delete/:id', async (req, res) => {
//     const {id} = req.params;

//     await BlogModel.deleteOne({_id: id});

//     console.log('Blog deleted successfully')

//     res.redirect('/')
// })

// // Edit a blog
// router.get('/update/:id', async (req, res) => {
//     const {id} = req.params;
   
//     const updateBlog = await BlogModel.findOne({_id: id})

//     res.render('update', {update: updateBlog})
// })

// // Update changes to a blog
// router.post('/update/:id', async (req, res) => {
//     const {id} = req.params;
//     const {title, content} = req.body;
   
//     await BlogModel.updateOne({_id: id}, {title, content})

//     res.redirect('/')
// })



// module.exports = router;