const express = require("express")
const app = express();
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")
const path = require("path")

// config
dotenv.config({path:"backend/config/config.env"})


// middlewares
app.use(express.json({
    limit:"10000mb"
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({
        limit:"10000mb",
        extended:true
}))
app.use(fileUpload())


// Route imports
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute")

// routes
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use('/api/v1',order)
app.use("/api/v1",payment)


// middleware for error
app.use(errorMiddleware)


module.exports = app