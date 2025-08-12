const jwt = require("jsonwebtoken")
const User = require("../models/user")


const userAuth = async (req, res, next) => {

    try {
        const token =  req.cookies?.token 
        if(!token) {
            throw new Error("Token not found !!!")
        }
    
        const decodedToken = await jwt.verify(token, "abcd@1234")
        if(!decodedToken) {
            throw new Error("Invalid token !!!")
        }
        const userId = decodedToken?.id
    
        const user = await User.findById(userId)
        if(!user) {
            throw new Error("User not found !!!")
        }

        req.user = user // Attach user to request object for later use
        next()
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).send({error: "Unauthorized access. Please log in."});
    }

}

module.exports = {
    userAuth
}