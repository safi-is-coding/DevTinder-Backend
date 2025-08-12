const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({    
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    }, 
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid..." + value)
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not a valid gender type !`
        },
        // validate(value){
        //     if(!["male", "female", "others"].includes(value)){
        //         throw new Error("gender data is not valid...")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://www.w3schools.com/howto/img_avatar.png"
    },
    about: {
        type: String,
        default: "Hello, I am using this app"
    },
    skills: {
        type: [String],
    }
}, 
{
    timestamps: true
})


userSchema.pre("save", async function (next) {
    try {
        const user = this
        const bcrypt = require("bcrypt")
        if(user.isModified("password")) {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            user.password = hashedPassword
        }
        next()
    } catch (error) {
        console.error("Error hashing password:", error.message);
        next(error)
    }
})

userSchema.methods.getJWT = async function () {
    try {
        const user = this
        const jwt = require("jsonwebtoken")
    
        const token = await jwt.sign({id: user._id}, "abcd@1234", {expiresIn: "1d"})
        return token

    } catch (error) {
        console.error("Error generating JWT:", error.message);
        throw new Error("Could not generate JWT");
    }
}

userSchema.methods.validatePassword = async function (passwordByinputUser){
    try{
        const user = this
        const bcrypt = require("bcrypt")

        const passwordInDB = user.password
        const isPasswordValid = await bcrypt.compare(passwordByinputUser, passwordInDB)
        // console.log(isPasswordValid);
        return isPasswordValid

    }catch(error) {
        console.error("Error validating password:", error.message);
        throw new Error("Could not validate password");
    }
}



const User = mongoose.model("User", userSchema)

module.exports = User