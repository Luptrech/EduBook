// backend/routes/userRoutes.js
const express = require('express');
const router  = express.Router();
const { registerUser, loginUser, getProfile, iforgot, followUser } = require('../controllers/userController');
const passport = require('passport');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);
router.post('/iforgot', iforgot);
router.post('/follow/:id', passport.authenticate('jwt', { session: false }), followUser);

module.exports = router;
