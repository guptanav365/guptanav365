const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth/login/failed',
  session: true,
}), (req, res) => {
  res.redirect('http://localhost:3000/dashboard');
});

// Email/password signup
router.post('/signup', (req, res) => {
  // TODO: Implement signup logic
  res.send('Signup endpoint');
});

// Email/password login
router.post('/login', (req, res) => {
  // TODO: Implement login logic
  res.send('Login endpoint');
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:3000/');
  });
});

// Auth status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

module.exports = router;