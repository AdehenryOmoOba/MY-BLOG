const AdminModel    = require('./models/admin-model');
const LocalStrategy = require('passport-local');
const bcrypt        = require('bcrypt');




function initialize(passport) {

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

}


module.exports = initialize;