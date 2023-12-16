const User  = require('../model/user');
const Review = require('../model/review');


//employee giving review to other employee function
module.exports.setReview = async function(req, res){
    try{
        let recipent = await User.findById(req.params.id);
        if(!recipent){
            console.log("not valid");
            return res.redirect('back');
        }

        for(let i = 0; i< req.user.userToReview.length; i++){
            if(req.user.userToReview[i] == recipent.id){
                let deletes = req.user.userToReview.splice(i, 1);
                req.user.save();
            }
        }

        for(let i = 0; i<recipent.reviewReceived.length; i++){
            if(req.user){
                if(recipent.reviewReceived[i] == req.user.id){
                    req.user.userToReview.pop(i);
                    console.log(req.body.setReview);
                    const new_review = Review.create({
                        content: req.body.setReview,
                        reviewer : recipent.id,
                        reviewed: req.user.id,
                        
                    });

                    if(!new_review){
                        console.log('no review');
                    }

                    return res.redirect("/");
                }
            }else{
                req.flash("login first");
                return res.redirect("/");
            }
        }
        return res.redirect('/');
        }catch(err){
        console.log(err);
        return res.redirect('/user/assignWork');
    }
}