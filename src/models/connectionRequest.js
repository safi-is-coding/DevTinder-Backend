const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        required: true,
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    toUserId: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        required: true,
        type: String,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type !`
        }
    }
}, 
{
    timestamps: true
})

connectionRequestSchema.index({fromUserId:1, toUserId:1})

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this
    // check if fromserId === toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send a connection request to yourself")
    }
    // check if status is valid
    const allowedStatus = ["ignore", "interested", "accepted", "rejected"]
    if(!allowedStatus.includes(connectionRequest.status)){
        throw new Error(`Invalid status type ${connectionRequest.status}`)
    }
    // check if fromUserId and toUserId are different
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send a connection request to yourself")
    }
    
    next()
})

const connectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = connectionRequest