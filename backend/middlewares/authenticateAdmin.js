let jwt = require("jsonwebtoken")

module.exports.authenticateAdmin = (req, res, next) => {
    const token = req.cookies.token; // Extract token from cookie
    if (!token) {
        return res.status(401).json({
            "message": "Unauthorized",
            "status": "failed"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.isAdmin) {
            next()
        }
        else {
            res.status(302).json({
                "message": "Not a Admin",
                "status": "failed"
            })
        }
    } catch (err) {
        res.status(401).json({
            "message": "Unauthorized",
            "status": "failed"
        });
        console.log(err)
    }
}

module.exports.checkInputs = (req, res, next) =>{
    let { name, email, phone, address } = req.body;

    console.log(req)
    if (!name || !email || !phone || !address) {
        return res.status(400).json({
            "message": "Every Field is needed middleware",
            "status": "failed"
        })
    }
    else {
        next()
    }
}