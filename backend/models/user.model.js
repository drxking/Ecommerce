const mongoose = require("mongoose")

let userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [2, "First name must be at least 2 characters long"],
        maxLength: [50, "First name must be less than 50 characters"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [2, "Last name must be at least 2 characters long"], 
        maxLength: [50, "Last name must be less than 50 characters"]
    },
    email:{
        type:String,
        required:true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: [8, "Password must be at least 8 characters long"],
        maxLength:[255,"Password must be lesser than 255"]
    }
})

module.exports = mongoose.model("user",userSchema)