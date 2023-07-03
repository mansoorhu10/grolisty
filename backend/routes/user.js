const express = require('express');

const router = express.Router();

// Controller functions
const {loginUser, signUpUser } = require('../controllers/userController');

// Login route
router.post('/login', loginUser);

// Sign Up route
router.post('/signup', signUpUser);

module.exports = router;