const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()
require("./config/db")

let userRouter = require("./routes/user.router")
let productRouter = require("./routes/product.router")
let adminRouter = require("./routes/admin.router")
let utilsRouter = require("./routes/utlis.router")
let vendorRouter = require("./routes/vendor.router")
let typeRouter = require("./routes/type.router")

let app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ urlencoded: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ACCESS,
    credentials: true
}))


app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/admin", adminRouter)
app.use("/utils", utilsRouter)
app.use("/vendors", vendorRouter)
app.use("/types", typeRouter)

app.use("*", (req, res) => {
    res.status(404).send({
        "message":"404 Not Found",
        "status":"failed"
    })
})

module.exports = app