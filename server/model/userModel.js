const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide Name'],
    },
    email: {
        type: String,
        required: [true, 'Please Provide Email'],
        unique: true,
        validate: {
            validator: function (value) {
                return Validator.isEmail(value);
            },
            message: 'Please Provide a Correct Email Address',
        },
    },
    password: {
        type: String,
        required: [true, 'Please Provide Password'],
        maxlength: 10,
        select: false,
    },
    avatar: {
        type: String
        
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createDate: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Generate JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRES_IN });
};

// Compare entered password with hashed password
userSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate reset token
userSchema.methods.getResetToken = function () {
    const token = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

    return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
