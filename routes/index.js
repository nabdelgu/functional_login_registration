const express = require('express');
const router = express.Router();
const { ensureAuthenticated , forwardAuthenticated  } = require('../config/auth');
//Welcome page
router.get('/', forwardAuthenticated, (req,res) => res.render('welcome'));
router.get('/about', (req,res) => res.render('about'));
router.get('/contact', (req,res) => res.render('contact'));
router.get('/HowItWorks', (req,res) => res.render('howItWorks'));

router.post('/about', (req,res) => {
  console.log("here");
    res.render('about');
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req,res) =>
  res.render('dashboard', {
    name: req.user.name
}));


module.exports = router;
