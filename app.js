// Requirements
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

require('./db')
const express       = require('express');
const app           = express();
const session       = require('express-session');
const { urlencoded }     = require('body-parser');
const mongoose           = require('mongoose');
const path               = require('path/posix');
// const blogRouter    = require('./controllers/blog-control');
const AdminModel    = require('./models/admin-model')
const bcrypt        = require('bcrypt');
const passport      = require('passport');
const LocalStrategy = require('passport-local');
const BlogModel     = require('./models/blog-model')


// Middlewares
app.use('/public', express.static('public'))
app.use(express.urlencoded({extended: true}))
// app.use('/', blogRouter)
app.set('view engine', 'ejs')
app.use(session({secret: process.env.SESSION_SECRETE, resave: false, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())

// PassportJS
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => AdminModel.findById(id, (err, user) => done(err, user)));

passport.use(new LocalStrategy( function (username, password, done) {
    // Check username in database
    AdminModel.findOne({username: username}, function (err, user) {
        if (err) {return done(err)}
        if (!user) {return done(null, false, {message: 'Username does not exist!'})}
    // Check Password in the database
        bcrypt.compare(password, user.password, function (err, res){
        if (err) {return done(err)}
        if (res === false || res === undefined) {return done(null, false, {message: 'Password is Incorrect!'})}
    // Return user if Username and password are correct
        return done(null, user)
        })
    })
}))



// Routes


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/')
    }
}

function isLoggedOut(req, res, next) {
  if (!req.isAuthenticated()){
      return next()
  } else {
      res.redirect('/admin')
  }
}


// Get Admin Login Page
app.get('/admin', (req, res) => {    
     
    res.render('admin')
})

// Admin Login

app.post('/admin', passport.authenticate('local', {successRedirect: '/admin-index', failureRedirect: "/admin"}))

// Admin Index page
app.get('/admin-index', isLoggedIn , async (req, res) => {    
     
    const allBlogs = await BlogModel.find({});

    res.render('admin-index', {blogs: allBlogs})
})

app.get('/admin-oneblog/:id', isLoggedIn , async (req, res) => {

    const {id} = req.params;
     
    const blog = await BlogModel.findOne({_id: id});

    res.render('admin-oneBlog', {oneBlog: blog})
})

// Get Admin Sign Up page
app.get('/admin/sign-up', isLoggedIn , (req, res) => {
     
    res.render('admin-register')
})

//Admin Sign Out
app.get('/sign-out', (req, res) => {
      req.logOut();
      res.redirect('/admin')
})



// Admin Sign Up
app.post('/admin/sign-up' , async (req, res) => {
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


// Read all blogs
app.get('/', async (req, res) => {
     
    const allBlogs = await BlogModel.find({});
    
    res.render('index', {blogs: allBlogs})
})

// Compose New blog
app.get('/compose' , isLoggedIn, (req, res) => {
    res.render('composeBlog')
})

// Add New blog
app.post('/compose', isLoggedIn , async (req, res) => {
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
app.get('/blog/:id', async (req, res) => {
  const {id} = req.params;
  
  const blog = await BlogModel.findOne({_id: id});

  res.render('oneBlog', {oneBlog: blog})

})

// Delete a blog
app.get('/delete/:id', isLoggedIn , async (req, res) => {
    const {id} = req.params;

    await BlogModel.deleteOne({_id: id});

    console.log('Blog deleted successfully')

    res.redirect('/admin-index')
})

// Edit a blog
app.get('/update/:id', isLoggedIn , async (req, res) => {
    const {id} = req.params;
   
    const updateBlog = await BlogModel.findOne({_id: id})

    res.render('update', {update: updateBlog})
})

// Update changes to a blog
app.post('/update/:id', isLoggedIn , async (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;
   
    await BlogModel.updateOne({_id: id}, {title, content})

    res.redirect('/admin-index')
})











// Listening port
app.listen(5000, () => {
    console.log('Server is running on port 5000...')
})