const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require("cookie-parser")
const cors = require('cors')
const dotenv = require("dotenv")
dotenv.config({
    path: './.env'
})

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: 'http://localhost:5173', 
    credentials: true, // allow credentials to be sent
}))
// middleware to read json
app.use(express.json());  // use as a middleware to read json data from the body
app.use(cookieParser())   // used as a middleware to read the cookies data 


// importing the routes
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)


// db connection
connectDB()
.then(()=> {
    console.log("Database connected successfully")
    
    app.listen(port,() => {
        console.log(`Server is listening on port ${port}`);
    })
})
.catch((e) => {
    console.error("Database connection failed:", e.message);
})

