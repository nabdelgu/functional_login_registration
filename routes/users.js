const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

//login
router.get('/login', forwardAuthenticated, (req,res) => res.render('login'));

//Registration
router.get('/register', forwardAuthenticated, (req,res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
  console.log(req.body);
  const { name, email, password, password2, checkBox1, checkBox2 } = req.body;
  console.log(checkBox1);
  console.log(checkBox2);
  let errors = [];

  const emailUpper = email.toUpperCase();

  // Check required fields
  if(!name || !email || !password || !password2){
    errors.push({ msg: 'Please fill in all fields' });
  }
  // Check if emailAis a SELU email
  if(emailUpper.includes("SELU.EDU")){
    errors.push({ msg: 'Cannot use SELU email' });
  }

  //Check passwords match
  if(password != password2){
    errors.push({msg: 'Passwords do not match'});
  }

  //Check pass length
  if(password.length < 6){
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if(errors.length > 0){
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }else {
    //validation passes
    User.findOne({email: email }).then(user => {
          if(user){
            //user exists
            errors.push({ msg: 'Email is already registered' });
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            });
          } else{
            const newUser = new User({
              name,
              email,
              password
            });

            // Hash Password
            bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              newUser.save()
                  .then(user => {
                    req.flash('sucess_msg', 'You are now registered and can log in');
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
            }));
          }
        });

  }
});

// Login Handle
router.post('/login', (req,res,next) => {
  passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res,next);
});

// Logout Handle
router.get('/logout', (req,res) => {
  req.logout();
  req.flash('sucess_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;
