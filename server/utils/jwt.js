const sendToken = (user, statusCode, res) => {

    const token = user.getJwtToken();

    //Cookies
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax', 
    };
    

    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            status: "Success",
            token,
            user
        })
}

module.exports = sendToken;