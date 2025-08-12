const express = require('express')

const User = require("../models/user")
const {validateSignUpData} = require("../utils/validation")
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")


const requestRouter = express.Router()


// send connectionRequest
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        // validate the status
        const allowedStatus = ["interested", "ignore"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: `Invalid status type ${status}`})
        }

        // check if the user exists
        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message: "User not found"})
        }

        // check if there is an existing ConnectionRequest
        const existingRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingRequest){
            return res.status(500).json({
                message: "Connection request already exists between these users"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()
        
        // Get sender's name (from logged-in user object)
        const fromUserName = req.user.firstName || "You";
        const toUserName = toUser.firstName || "User";

        // Create dynamic success message
        let successMessage = "";
        if (status === "interested") {
            successMessage = `${fromUserName} has shown interest in connecting with ${toUserName}.`;
        } else if (status === "ignore") {
            successMessage = `${fromUserName} has ignored the connection request to ${toUserName}.`;
        }
        
        return res.status(201).json({message: successMessage, data:data})

    } catch (error) {
        console.error("Error sending connection request:", error.message);
        res.status(500).json({error: "Error sending connection request"});
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res)=> {
    try {
        
        const loggedInUser = req.user

        const {status, requestId} = req.params

        //validate the status
        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(500).json({message: "Invalid status"})
        }

        // checkif the request exists

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest){
            return res.status(404).json({
                message: "Connection request not found or already reviewed"
            })
        }
        // update the status of the request
        connectionRequest.status = status

        const data  = await connectionRequest.save()
        
        res.status(200).json({message: `Connection request ${status}`, data : data})


    } catch (error) {
        console.error("Error reviewing connection request:", error.message);
        res.status(500).json({error: "Error reviewing connection request"});
        
    }
})

module.exports = requestRouter