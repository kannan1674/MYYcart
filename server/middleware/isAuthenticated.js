const ErrorHandler = require('../utils/errorHandler');
const User = require('../model/userModel');
const catchAsyncError = require('./catchAsync');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Authentication token is missing', 401));
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decode.id);
    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} not allowed`,401))
        }
        next();
    }
}