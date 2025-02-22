const User = require('../model/userModel')
const cathAsyncError = require('../middleware/catchAsync')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')
const catchAsync = require('../middleware/catchAsync')
const nodeMailer = require('nodemailer');
const crypto = require('crypto')


exports.registerUser = cathAsyncError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        let avatar;
      
        if(req.file){
            avatar = `/uploads/user/${req.file.originalname}`
        }

        const user = await User.create({
            name, password, email, avatar
        })

        const token = user.getJwtToken();

        sendToken(user, 201, res)
    } catch (error) {
        next(error)

    }
})
//Sign-in
exports.signin = cathAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please Enter Email & Password', 400));
    }

    // Find user and include the password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)
});
//Logout User
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).status(200).json({
        status: "Success",
        message: "User Logout successfully "
    })
}
//Forgot Password
exports.forgotPassword = cathAsyncError(async (req, res, next) => {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 400));
    }

    // Generate a reset token
    const resetToken = user.getResetToken();

    // Save the user without validation
    await user.save({ validateBeforeSave: false });

    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/${resetToken}`;

    const message = `You requested a password reset. Please make a PUT request to the following URL:\n\n${resetUrl}`;

    try {
        // Configure the transporter
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: "testapi616@gmail.com", // Ensure this is the correct email
                pass: "ygeh lqub lzyg vibf ",  // Ensure this is the correct app password
            },
        });

        // Define the email options
        const mailOptions = {
            from: `${process.env.SMTP_MAIL_NAME} <${process.env.SMTP_USER}>`, // Ensure these env variables are correct
            to: user.email,
            subject: 'Password Recovery',
            text: `Click the link below to reset your password:\n${process.env.FRONTEND_URL}/${resetToken}`, // Fallback for clients that don't support HTML
            html: `
                <html>
                    <body>
                        <p>Click the link below to reset your password:</p>
                        <a href="${process.env.FRONTEND_URL}/${resetToken}" style="color: blue; text-decoration: underline; cursor: pointer;">
                            ${process.env.FRONTEND_URL}/${resetToken}
                        </a>
                    </body>
                </html>
            `,
        };
        
        
        

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`,
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Email sending error:', error);  // This will log the detailed error from nodeMailer

        // Revert changes if email sending fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler('Email could not be sent', 500));
    }
});

//ResetPassword
exports.resetPassword = cathAsyncError(async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpire: {
                $gt: Date.now()
            }
        })
        if (!user) {
            return next(new ErrorHandler('Invaild or Expired Token', 400))
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler('Password and CurrentPassword not Match'))
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false })

        sendToken(user, 201, res)

    } catch (error) {
        next(error)

    }
})

//User Profile
exports.getUserProfile = cathAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        res.status(200).json({
            status: "Success",
            user
        })
    } catch (error) {
        next(error)
    }
})

//Change Password
exports.changePassword = async (req, res, next) => {

        const user = await User.findById(req.user.id).select("+password")

        //check old Password
        if (!await user.isValidPassword(req.body.oldPassword)) {
            return next(new ErrorHandler('Password Incorrect', 400))
        }
        user.password=req.body.password;
        await user.save();
        res.status(200).json({
            status: "Success",

        })
   
    
}

//Update Profile
exports.updateProfile = cathAsyncError(async(req,res,next)=>{
 try {
    let userData={
        name:req.body.name,
        email:req.body.email
    }
    let avatar;
    if(req.file){
        avatar = `/uploads/user/${req.file.originalname}`
        userData = {...userData,avatar}
    }

    const user =await User.findByIdAndUpdate(req.user.id,userData,{
        new:true,
        runValidators:true
    })
  
    res.status(200).json({
        status: "Success",
        user

    })
 } catch (error) {
    next(error)
 }
})

//ADMIN Routes: get All Users
exports.admingetallusers = async(req,res,next)=>{
    try {
        const user = await User.find()
        res.status(200).json({
            status:"Success",
            user
        })
    } catch (error) {
        next(error)
        
    }
}

//Admin:Get singleuser by ID
exports.admingetuser = async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return next(new(`User Not Find forthis ID ${req.prams.id}`,400))
        }
        res.status(200).json({
            status:"Success",
            user
        })
    } catch (error) {
        next(error)
        
    }
}
//Admin:Update User
exports.adminupdateUser = async(req,res,next)=>{
    try {
        const data={
            name:req.body.name,
            email:req.body.email,
            role:req.body.role
        }
        if(!data.name || !data.email || !data.role){
            return next (new ErrorHandler('Please Enter Name,Email and Role',400))
        }
        const users = await User.findByIdAndUpdate(req.user.id,data,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            status:"success",
            users
        })
    } catch (error) {
        next(error)
        
    }
}

//Admin:Delete User
exports.admindeleteUser = async(req,res,next)=>{
    try {
        let user =await User.findById(req.params.id)

        if(!user){
            return next(new ErrorHandler('Provided ID '))
        }
        user=await User.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status:'success'
        })
    } catch (error) {
        next(error)
    }
}
