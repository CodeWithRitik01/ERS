const User = require('../model/user');


//home page
module.exports.home = async function(req, res){
    const user = await User.find({});

    return res.render('home', {
        title:"EWS | Home",
        all_users : user
    });
}