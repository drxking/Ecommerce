const jwt = require("jsonwebtoken")


module.exports.loginAdmin = (req, res) => {
    let mail = process.env.ADMIN_EMAIL;
    let pass = process.env.ADMIN_PASSWORD;
    let { email, password } = req.body;
    if (mail === email) {
        if (pass === password) {
            let token = jwt.sign({ "email": mail, isAdmin: true }, process.env.JWT_SECRET)
            res.cookie("token", token, {
                secure: true,
                sameSite: "None",
                httpOnly: true
            })
            res.json({
                "message": "Logged in successfully",
                "status": "success"
            })

        }
        else {
            res.json({
                "message": "Password doesnot match",
                "status": "failed"
            })
        }
    }
    else {
        res.json({
            "message": "Email doesnot match",
            "status": "failed"
        })
    }
}