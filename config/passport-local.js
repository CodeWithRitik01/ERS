const passport = require('passport');

const localStrategy = require('passport-local').Strategy;

const User = require('../model/user');

passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true


}, async function (req, email, password, done) {
    try{
        const user = await User.findOne({email: email});

        if(!user || user.password != password){
            return done(null, false);
        }
        return done(null, user);
    }catch(err){
        return done(err);
    }
}));



passport.serializeUser(function(user, done){
    done(null, user.id);
});


passport.deserializeUser(async function(id, done){
    try{
        const user = await User.findById(id);
        if(!user){
            return done(null, false);
        }
        return done(null, user);
    }catch(err){
        return done(err);
    }
})

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/users/sign_in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;