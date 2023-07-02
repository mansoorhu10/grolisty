const User = require('../models/userModel');
const jsonWebToken = require('jsonwebtoken');

const createToken = (_id) => {
    return jsonWebToken.sign({_id}, process.env.SECRET, { expiresIn : '3d' });
}

// Login user
const loginUser = async (request, response) => {

    const { email, password } = request.body;

    try {
        const user = await User.login(email, password);

        // Create a token
        const token = createToken(user._id);
        
        response.status(200).json({email, token});
    } catch (error) {
        response.status(400).json({error: error.message});
    }
}

// Sign up user
const signUpUser = async (request, response) => {
    const {email, password} = request.body;

    try {
        const user = await User.signup(email, password);

        // Create a token
        const token = createToken(user._id);
        
        response.status(200).json({email, token});
    } catch (error) {
        response.status(400).json({error: error.message});
    }

}

module.exports = { loginUser, signUpUser }