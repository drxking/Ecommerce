let userModel = require("../models/user.model")
let bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.json({
                message: "Required Field is Missing!",
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
            status: "success",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
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
            status: "success",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        })

    } catch (err) {
        res.status(500).json({
            message: "something went wrong",
            status: "failed"
        })
        console.log(err)
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.json({
                status: "failed",
                message: "Not authenticated"
            });
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let email = decoded.token || decoded.email;
        if (!email) {
            return res.json({
                status: "failed",
                message: "Invalid token"
            });
        }
        let user = await userModel.findOne({ email }).select("-password");
        if (!user) {
            return res.json({
                status: "failed",
                message: "User not found"
            });
        }
        return res.json({
            status: "success",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (err) {
        return res.json({
            status: "failed",
            message: "Session expired or invalid"
        });
    }
}

module.exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            secure: true,
            sameSite: "None",
            httpOnly: true
        });
        return res.json({
            status: "success",
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: "Logout failed"
        });
    }
}