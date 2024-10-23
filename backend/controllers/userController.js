const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const User = require("../models/userModel")
const sendToken = require("../utils/jwtTokens")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")

// Register user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    // encoded url of images we are uploading
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"EcommerseUserAvatars",
        width:150,
        crop:"scale"
    })

    const {name,email,password} = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    })

    sendToken(user,201,res)
})

//Login user
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{

    const {email,password} = req.body

    // if user has given email and password
    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password .",400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    
    sendToken(user,200,res)

})

// Logout user
exports.logoutUser = catchAsyncErrors(async(req,res,next)=>{
    
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true

    })

    res.status(200).json({
        success:true,
        message:"logged out ."
    })
})

// forgot password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

  const user = await User.findOne({email:req.body.email})

  if(!user){
    return next(new ErrorHandler("User not found",404))
  }

  // Get resetPassword token
  const resetToken = await  user.getResetPasswordToken()
  
  await user.save({validateBeforeSave:false})

  

// const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
 
  const message = `Your password reset token is :\n\n${resetPasswordUrl}\n\nif you have not requested this email then please ignore it.`
  
  try {

    await sendEmail({
        email:user.email,
        subject:`Ecommmerse Password Recovery`,
        message:message
    })
   

    res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully.`
    })
    
  } catch (error) {

     user.resetPasswordToken=undefined
     user.resetPasswordExpire=undefined
     await user.save({validateBeforeSave:false})

     return next(new ErrorHandler(error.message,500))
  }
})

// Reset password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    // finding in DB
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt:Date.now()
        }
    })

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired .",400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does'nt match.",400))
    }

    user.password = req.body.password

    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined
    await user.save()

    sendToken(user,200,res)

})


// Get User Details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    // as user already saved to req in middleware auth - only loggedInUser
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
    
})

// Update user password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    // as user already saved to req in middleware auth - only loggedInUser
    const user = await User.findById(req.user.id).select("+password")

    // current password match
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400))
    }


    if(req.body.newPassword !== req.body.newConfirmPassword){
        return next(new ErrorHandler("Password does'nt match.",400))
    }

    if(req.body.newPassword === req.body.oldPassword){
        return next(new ErrorHandler("Password can't be same previously used.",401))
    }

    // update with new password
    user.password = req.body.newPassword

    await user.save()

    sendToken(user,200,res)
})

//Update user profile
exports.updateUserProfile = catchAsyncErrors(async(req,res,next)=>{

    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    // we will add cloudinary later -done
    if(req.body.avatar !== "" && req.body.avatar !== undefined){
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id
        await cloudinary.v2.uploader.destroy(imageId)

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"EcommerseUserAvatars",
            width:150,
            crop:"scale"
        })
        newUserData.avatar = {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
})


// admin ke liyee : Admin


//Get All users (admin)
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//Get single user detail (admin)
exports.getSingleUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User doest not exits with this id : ${req.params.id}.`,404))
    }

    res.status(200).json({
        success:true,
        user
    })
})

// Role update By admin for any user (admin)
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User doest not exits with this id : ${req.params.id}.`,404))
    }

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }


    const updatedUser = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
})

// Delete any user By admin  (admin)
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User doest not exits with this id : ${req.params.id}.`,404))
    }

    // we will remove cloudinary image
    const imageId = user.avatar.public_id
    await cloudinary.v2.uploader.destroy(imageId)

    // db se remove
    const deletedUser = await User.findByIdAndDelete(user._id)

    res.status(200).json({
        success:true,
        message:"User deleted successfully."
    })
})
