const app = require("./app")
const dotenv = require("dotenv")
const connectToDatabase = require("./config/database")
const cloudinary = require("cloudinary")

// Handling uncaught error
process.on("uncaughtException",err=>{
    console.log(`Error ${err}.`);
    console.log(`Shutting down the server due to uncaught exception error.`);
    process.exit(1)

})



// config
dotenv.config({path:"backend/config/config.env"})



// Connect with Database
connectToDatabase()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// localhost connection for server
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
    
})


// unhandled Rejections errors
process.on("unhandledRejection",err=>{
    console.log(`Error ${err}.`);
    console.log(`Shutting down the server due to unhandled rejection error.`);
    server.close(()=>{
        process.exit(1)
    })
})