const User = require('../models/userModel');

// Login user
const loginUser = async (request, response) => {
    response.json({message: 'login user'});
}

// Sign up user
const signUpUser = async (request, response) => {
    const {email, password} = request.body;

    try {
        const user = await User.signup(email, password);

        response.status(200).json({email, user});
    } catch (error) {
        response.status(400).json({error: error.message});
    }

}

module.exports = { loginUser, signUpUser }