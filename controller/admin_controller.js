const User  = require('../model/user');
const Review = require('../model/review');

module.exports.EmployeePage = async function(req, res){
if(!req.isAuthenticated()){
    req.flash("Your can not visit here");
    return res.redirect('/users/sign_in');
}
if(req.user.isAdmin == false){
    req.flash("Your can not visit here");
    return res.redirect('/');
}
    const user = await User.find({});

    return res.render('employeeList',{
         title: "Employee",
         employee: user
    })
}



module.exports.deleteEmployee = async function(req, res){
         try{
             if(!req.isAuthenticated){
                req.flash("you can not remove other employee");
                return res.redirect('/users/sign_in');

             }

             if(!req.user.isAdmin){
                req.flash("you can not remove other employee");
                return res.redirect('/');
             }

             let employee = await User.deleteOne({_id : req.params.id});

             req.flash('User is Deleted');
             return res.redirect('back');
         }catch(err){
              console.log(err);
              return res.redirect('/');
         }
}


module.exports.assignWork = async function(req, res){
    const user = await User.find({});


    return res.render('assignWork',{
        title: "Assign work",
        employee: user
    })
}

module.exports.selectToReview = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            req.flash("Login first");

            return res.redirect('/users/sign_in');
        }else{
            let employee = await User.findById(req.user.id);
            console.log(employee);

            if(employee.isAdmin == false){
                req.flash('You are not authorised to do this');

                return res.redirect('/users/sign_in');
            }else if(req.body.sender == req.body.receiver){
                 req.flash('You are not authorised to do this');

                 return res.redirect('/users/sign_in');
            }else{
                let sender = await User.findById(req.body.sender);
                let receiver = await User.findById(req.body.receiver);

                sender.userToReview.push(receiver);
                sender.save();
                receiver.reviewReceived.push(sender);
                receiver.save();

                req.flash('Task Assigned');
                return res.redirect('/admin/assignWork');
            }
        }

    }catch(err){
        console.log(err);
        return res.redirect('/admin/assignWork');
    }
}

module.exports.newAdmin = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            req.flash("Login first");

            return res.redirect('/users/sign_in');
        }else{
            let employee = await User.findById(req.user.id);

            if(employee.isAdmin == false){
                req.flash("You are not authorised to do this");

                return res.redirect('/users/sign_in');
            }
            if(req.user.isAdmin){
                let newAdmin = await User.findById(req.body.newAdmin);
                
                newAdmin.isAdmin = "true";
                newAdmin.save();
                return res.redirect('/admin/assignWork');
            }
           
        }
    }catch(err){
        console.log('err');
        return res.redirect('/admin/assignWork');
    }
}


module.exports.removeAdmin = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            req.flash("Login first");

            return res.redirect('/users/sign_in');
        }else{
            let employee = await User.findById(req.user.id);

            if(employee.isAdmin == false){
                req.flash("You are not authorised to do this");

                return res.redirect('/users/sign_in');
            }
            if(req.user.isAdmin){
                let newAdmin = await User.findById(req.body.removeAdmin);
                
                newAdmin.isAdmin = "false";
                newAdmin.save();
                return res.redirect('/admin/assignWork');
            }
           
        }
    }catch(err){
        console.log('err');
        return res.redirect('/admin/assignWork');
    }
}


module.exports.showReview = async function(req, res){
    const review = await Review.find({});

    const arr = [];
     for(let i = 0 ; i<review.length; i++){
         const receiver = await User.findById(review[i].reviewer);
         const sender = await User.findById(review[i].reviewed);

         arr.push({
            content: review[i].content,
            sender: sender.name,
            receiver: receiver.name
         })
         
        
     }

    return res.render('showReview',{
        title: "Show Reviews",
        reviews : arr
    })
}