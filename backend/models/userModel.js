const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

// Static sign up method
userSchema.statics.signup = async function(email, password) {
    const emailExists = await this.findOne({ email });

    if (emailExists) {
        throw Error('Email is already in use');
    }

    const salt = await bcrypt.genSalt(10); // Generating salt data to encrypt passwords
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash });

    return user;
}


module.exports = mongoose.model('User', userSchema);