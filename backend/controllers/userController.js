const User = require('../models/userModel');

// Login user
const loginUser = async (request, response) => {
    response.json({message: 'login user'});
}

// Sign up user
const signUpUser = async (request, response) => {
    response.json({message: 'sign up user'});
}

module.exports = { loginUser, signUpUser }