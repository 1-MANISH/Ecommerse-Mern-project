const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name."],
        maxLength:[30,"Name can't exceed more than 30 characters."],
        minLength:[4,"Name should have more than 5 characters."]
    },
    email:{
        type:String,
        required:[true,"Please enter your email."],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password."],
        minLength:[8,"Password should have more than 7 characters."],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})


// password hashing
userSchema.pre("save",async function(next){

    // check for update : baar baar password hash no ho jaaye profile update ke time
    if(!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password,10)
})

// JWT Tokens
userSchema.methods.getJWTToken = function(){

    return jwt.sign({
            id:this._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES
        }
    )
}

// Compare password
userSchema.methods.comparePassword =  async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

// Generating password reset token
userSchema.methods.getResetPasswordToken = async function(){

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex") // 20 length string


    // Hashing 
    const tokenCrypto = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    // adding to user Schema
    this.resetPasswordToken = tokenCrypto
    this.resetPasswordExpire = Date.now() + 15*60*1000 // expires in 15 minutes

    return resetToken
}


module.exports = mongoose.model("User",userSchema)