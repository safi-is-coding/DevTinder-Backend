const mongoose = require('mongoose')

const connectDB = async()=> {
    await mongoose.connect(
        // process.env.MONGODB_URL
        "mongodb+srv://safimaz:safimaz123@backenddb.wphyzpb.mongodb.net/DevTinder"
    )
}

module.exports = connectDB;

