const express = require('express')

const User = require("../models/user")
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")


const authRouter = express.Router()

//signup api
authRouter.post("/signup", async (req, res) => {
    
    //validation
    validateSignUpData(req)

    const {firstName, lastName, emailId, password, skills, age, gender, about, photoUrl} = req.body

    // encrypt the password
    // const hashedPassword = await bcrypt.hash(password, 10)
    // console.log("hashed password", hashedPassword);

    const user = new User({
        firstName, 
        lastName, 
        emailId, 
        password,
        skills,
        age,
        gender,
        about,
        photoUrl
    })

    try {
        const savedUser = await user.save()

        const token = await savedUser.getJWT()

        res.cookie("token", token, { expires: new Date(Date.now() + 900000), httpOnly: true })

        res.status(200).json({message: `${firstName} added successfully...`, data: savedUser})
    } catch (error) {
        console.error("Error adding user:", error.message);
        res.status(500).json({error: `Error adding user : ${error.message}`});
    }

})

// login api
authRouter.post("/login", async(req, res) => {
    const {emailId, password} = req.body

    try {
        const user = await User.findOne({emailId})

        if(!user){
            throw new Error("User not found with this emailId...")
        }
        // compare password
        const isPasswordValid = await user.validatePassword(password)
        
        if(isPasswordValid){

            const token = await user.getJWT()

            res.cookie("token", token, { expires: new Date(Date.now() + 900000), httpOnly: true })
            res.status(200).json({message:"Login Successfully", user: user})
            
        } else{
            throw new Error("Incorrect Password...")
        }
        
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({message: "Invalid Credentials !"});
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        // Clear the cookie by setting its expiration date to a past date
        res.cookie("token", null, 
        { expires: new Date(Date.now()), httpOnly: true }
        );
        
        // Optionally, you can also send a response message
        res.status(200).json({data: "Logout successful"});
    } catch (error) {
        console.error("Error during logout:", error.message);
        res.status(500).json({error: "Error during logout"});     
    }
})




module.exports = authRouter