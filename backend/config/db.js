const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI)

let db = mongoose.connection;
db.on("open",()=>{
    console.log("Connected MONGODB sucessfully")
})
db.on("error",(err)=>{
    console.log(`Error connecting to MongoDB \n ${err}`)
})

module.exports = db;