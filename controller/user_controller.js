const User  = require('../model/user');
const Review = require('../model/review');



//function to show profile page who is logged in
module.exports.profile = async function(req, res){
    try{
        if(!req.isAuthenticated){
            req.flash('error', 'Login first');
            return res.redirect('/users/sign_in');
        }
        const user = await User.findById(req.user.id);
        let review = await Review.find({reviewer: req.user.id});


        let recipent = [];
        for(let i = 0; i<user.userToReview.length; i++){
            let userName = await User.findById(user.userToReview[i]);
            recipent.push(userName);
        }

        let reviews = [];
        for(let i = 0; i<review.length; i++){
            let reviewUser = await User.findById(review[i].reviewed);
            if(reviewUser != null){
                let currUser = {
                    name: reviewUser.name,
                    content : review[i].content
                }
                reviews.push(currUser);
            }
        }

        return res.render('profile',{
            title: "profile",
           user: user,
           recipent: recipent,
           reviews: reviews
         })
    }catch(err){
        console.log(err, "error in profile");
        return res.redirect('back');
    }
}

//redirect to signup page
module.exports.signUp = async function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
      }
    return res.render('user_sign_up', {
        title:"user | signup"
    });
}


//redirect to signin page
module.exports.signIn = async function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
      }
    return res.render('user_sign_in', {
        title: "user | signin"
    });
}



//to create a employee 
module.exports.create = async function(req, res){
    try{
        if(req.body.password != req.body.confirm_password){
            req.flash('error' , 'Password should be equal to Confirm Password');

            return res.redirect('back');
        }
    
        const existingUser = await User.findOne({email: req.body.email});
        if(!existingUser){
            const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                isAdmin:false
            });
            return res.redirect('/users/sign_in');
        }else{
            console.log('User already exists:', existingUser);
            return res.redirect('back');
        }
    }catch(err){
        console.error('Error in user creation:', err);
        return res.status(500).send('Internal Server Error');
    }
  
}


//login funtion
module.exports.createSession = async function(req, res){
  
    req.flash('success', 'You are logged In');

    return res.redirect('/');
}



//sign out function
module.exports.destroySession = async function(req, res, next){
    req.logout(function(err){
        if(err){return next(err);}
        
        req.flash('success', 'You are logged out');

        res.redirect('/');
    });
}



//function by which any employee can be admin if he knows password
module.exports.makeAdmin = async function(req, res){
    try{
        if(req.body.admin_password == "password"){
            let user = await User.findById(req.user.id);
            user.isAdmin = true;
            user.save();
            console.log(user);
            return res.redirect('/');
         }else{
            console.log('no');
            return res.redirect('back');
         }
    }catch(err){
        console.log("cannot make admin",err);
        return;
    }
   
}