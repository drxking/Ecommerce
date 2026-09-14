const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
require("dotenv").config()
require("./config/db")

let userRouter = require("./routes/user.router")
let productRouter = require("./routes/product.router")
let adminRouter = require("./routes/admin.router")
let utilsRouter = require("./routes/utlis.router")
let vendorRouter = require("./routes/vendor.router")
let typeRouter = require("./routes/type.router")
let collectionRouter = require("./routes/collection.router")
let homeConfigRouter = require("./routes/homeConfig.router")

let app = express()
app.set("trust proxy", 1)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ACCESS || "http://localhost:5173",
    credentials: true
}))

// Serve uploaded static files locally
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/admin", adminRouter)
app.use("/utils", utilsRouter)
app.use("/vendors", vendorRouter)
app.use("/types", typeRouter)
app.use("/collections", collectionRouter)
app.use("/home-config", homeConfigRouter)
app.use("/admin/home-config", homeConfigRouter)

app.use("*", (req, res) => {
    res.status(404).send({
        "message": "404 Not Found!",
        "status": "failed"
    })
})

module.exports = app