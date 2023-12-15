const express = require('express');

const router = express.Router();
const passport = require('passport');

const userController = require('../controller/user_controller');

router.get('/sign_up', userController.signUp);
router.get('/sign_in', userController.signIn);

router.post('/create', userController.create);
router.post('/create-session', 
  passport.authenticate('local', {
    failureRedirect:'/users/sign_in'
  })
,userController.createSession);

router.get('/logout', userController.destroySession);
router.get('/profile/:id',passport.checkAuthentication, userController.profile);
router.post('/makeAdmin', userController.makeAdmin);

module.exports = router;
