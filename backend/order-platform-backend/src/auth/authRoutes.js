const express = require('express');
const authController = require('./authController');

const router = express.Router();

router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/profile/:userId', (req, res) => authController.getProfile(req, res));

module.exports = router;