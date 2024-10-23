// Create token and saving in cookie
const sendToken = (user,statusCode,res) => {

    const token = user.getJWTToken()

    // options for cookies
    const options = {
        httpOnly:true,
        expires:new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ) , // currentDate + expiresDays (ms)
    }


    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        token,
        user
    })
}

module.exports = sendToken