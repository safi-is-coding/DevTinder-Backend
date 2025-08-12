const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

userRouter.get("/user/requests/received", 
    userAuth, 
    async (req, res) => {
        try {
            const loggedInUser = req.user
            
            const connectionRequest = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested"
            }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"])

            res.status(200).json({data: connectionRequest})

        } catch (error) {
            console.error("Error fetching user requests:", error);
            res.status(500).json({ message: "Internal server error" });
            
        }
    }
)


userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {

        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]).populate("toUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"])

        const data = connectionRequest.map((connection) => {
            if(connection.fromUserId._id.toString() === loggedInUser._id.toString()){
                return connection.toUserId
            }
            return connection.fromUserId
        })

        res.status(200).json({data: data})


    } catch (error) {
        console.error("Error fetching user connections:", error);
        res.status(500).json({ message: "Internal server error" });    
    }
})


userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query?.page) || 1
        let limit = parseInt(req.query?.limit) || 10
        limit = limit>50 ? 50 : limit

        const skip = (page - 1) * limit

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        // console.log(hideUsersFromFeed);

        // Fetch all users except those in the hideUsersFromFeed set
        const users = await User.find({
            $and : [
                { _id: { $ne: loggedInUser._id } }, // not the user itself
                { _id: { $nin: Array.from(hideUsersFromFeed) } } // not present in hideUsersFromFeed set
            ]
        })
        .select(["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"])
        .skip(skip)
        .limit(limit)

        res.status(200).json({data: users})

    } catch (error) {
        console.error("Error fetching user feed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = userRouter