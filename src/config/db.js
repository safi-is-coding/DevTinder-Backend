const mongoose = require('mongoose')

const connectDB = async()=> {
    await mongoose.connect(
        "mongodb+srv://safimaz:safimaz123@backenddb.wphyzpb.mongodb.net/DevTinder"
    )
}

module.exports = connectDB;

