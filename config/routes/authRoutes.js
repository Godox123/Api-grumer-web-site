const express = require('express');
const router = express.Router();
const passportJWT = require('../../middlewears/auth.middlewears');
const isAuthenticatedAdmin = require('../../middlewears/isAuthAdmin.middlewear');

const {
  signIn,
  signUp,
  signOut,
  forgot,
  reset,
} = require('../../controllers').authControllers;
const Users = require('../../models/user');

router.post('/register', signUp);

router.post('/login', signIn);

router.post('/user', passportJWT, (req, res, next) => {
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    phone: req.user.phone,
  });
  return next();
});

router.get('/logout', passportJWT, signOut);

router.post('/forgot', forgot);

router.post('/', passportJWT, isAuthenticatedAdmin, (req, res) => {
  Users.find({}).then(users => {
    return res.status(200).json(users);
  });
});

router.delete('/:id', passportJWT, isAuthenticatedAdmin, (req, res) => {
  Users.findOneAndDelete({
    _id: req.params.id,
  })
    .then(() => {
      res.status(200).json({ status: 'ok' });
    })
    .catch(err => {
      res.status(401);
      console.log(err);
    });
});

router.post('/reset/:token', reset);

module.exports = router;

// app.get('/auth/facebook/callback',
// passport.authenticate('facebook', {
//     session: false,
//     successRedirect : '/',
//     failureRedirect : '/'
// }), (req, res) => {
//     var token = req.user.jwtoken;
//     res.cookie('auth', token); // Choose whatever name you'd like for that cookie,
//     res.redirect('http://localhost:3000'); // OR whatever page you want to redirect to with that cookie
// });
