const express = require('express')

const User = require("../models/user")
const {validateProfileEditData} = require("../utils/validation")
const {userAuth} = require("../middlewares/auth")


const profileRouter = express.Router()

// authenticated user profile api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({data: user})
    
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({error: "Error fetching profile"});
    }
})


// update api
// profileRouter.patch("/profile/edit", async (req, res) => {
//     const userId = req.params?.userId
//     const data = req.body;


//     try {
//         const allowedUpdates = [
//             "photoUrl", "about", "gender", "age", "skills"
//         ]
    
//         const isUpdateAllowed = Object.keys(data).every((k)=> allowedUpdates.includes(k))
    
//         if(!isUpdateAllowed){
//             throw new Error("Update not allowed")
//         }

//         if(data?.skills.length > 10){
//             throw new Error("Skills cannot be more than 10")
//         }

//         const user = await User.findByIdAndUpdate(userId, data, {returnDocument: "before", runValidators: true})
//         if(!user) {
//             return res.status(404).send("User not found")
//         } else {
//             console.log(user);
//             res.send("User updated successfully")
//         }
//     } catch (error) {
//         console.error("Error updating user:", error.message);
//         res.status(500).send("Error updating user");
        
//     }
// })

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if(!validateProfileEditData(req)){
            throw new Error("Invalid Edit Request !")
        }

        const loggedInUser = req.user
        
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        
        await loggedInUser.save()

        res.status(200).json(
            {
                message: `${loggedInUser.firstName}, your profile is updated successfully...`,
                data: loggedInUser
            });
        
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({error: "Error updating profile"});
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body
        const loggedInUser = req.user

        if(!oldPassword){
            throw new Error("Old Password is required...")
        }
        if(!newPassword) {
            throw new Error("New Password is required...")
        }
        // compare old password
        const isPasswordValid = await loggedInUser.validatePassword(oldPassword)
        console.log("profile "+isPasswordValid);
        if(!isPasswordValid) {
            throw new Error("Old Password is incorrect...")
        }
        // update password
        loggedInUser.password = newPassword
        await loggedInUser.save()

        res.status(200).json({message: "Password updated successfully..."});

    } catch (error) {
        console.error("Error updating password:", error.message);
        res.status(500).json({error: "Error updating password"});
    }
})











// // all data api
// profileRouter.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({})
//         if(users.length === 0){
//             return res.status(404).send("No users found")
//         } else {
//             res.send(users)
//         }

//     } catch (error) {
//         console.error("Error fetching users:", error.message);
//         res.status(500).send("Error fetching users");
        
//     }

// })



// // get user by email id
// profileRouter.get("/user/:emailId", async (req, res) => {
//     const email = req.params.emailId;
//     // console.log(email);
//     try {
//         const user = await User.findOne({emailId: email})
//         if(user.length === 0){
//             return res.status(404).send("User not found")
//         } else {
//             res.status(200).send(user)
//         }
//     } catch (error) {
//         res.status(400).send("something went wrong")
//     }

// })

// // delete api
// profileRouter.delete("/user", async (req, res) => {
//     const userId = req.body.userId
//     try {
//         const user = await User.findByIdAndDelete(userId)
//         if(!user) {
//             return res.status(404).send("User not found")
//         } else {
//             res.send("User deleted successfully")
//         }
        
//     } catch (error) {
//         console.error("Error deleting user:", error.message);
//         res.status(500).send("Error deleting user");
        
//     }
// })


module.exports = profileRouter