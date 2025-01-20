let userModel = require("../models/user.model")
let bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: "name, email and password  is required",
                status: "failed"
            })
        }

        let user = await userModel.findOne({ email })
        if (user) {
            return res.json({
                message: "user already exists",
                status: "failed"
            })
        }
        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(password, salt);
        user = await userModel.create({
            firstName,
            lastName,
            email: email,
            password: hashedPassword
        })
        let token = jwt.sign({ "token": user.email }, process.env.JWT_SECRET)
        res.cookie("token", token, {
            secure: true,
            sameSite: "None",
            httpOnly: true
        })
        res.json({
            message: "user created successfully",
            status: "success"
        })

    } catch (err) {
        res.status(500).json({
            message: "something went wrong",
            status: "failed"
        })
        console.log(err)
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                message: "email and Password is required",
                status: "failed"
            })
        }
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                message: "user not found",
                status: "failed"
            })
        }
        let result = await bcrypt.compare(password, user.password)
        if (!result) {
            return res.json({
                message: "password doesnot match",
                status: "failed"
            })
        }
        let token = jwt.sign({ "token": user.email }, process.env.JWT_SECRET)
        res.cookie("token", token, {
            secure: true,
            sameSite: "None",
            httpOnly: true
        })
        res.json({
            message: "logged in successfully",
            status: "success"
        })

    } catch (err) {
        res.status(500).json({
            message: "something went wrong",
            status: "failed"
        })
        console.log(err)
    }
}