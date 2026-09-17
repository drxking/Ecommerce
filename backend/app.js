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

// `Origin` never contains a trailing slash, while environment variables often
// do. Normalize the configured values so a valid browser request is not
// rejected because of that small formatting difference. Multiple frontends can
// be supplied as a comma-separated CORS_ACCESS value.
const normalizeOrigin = (origin) => origin.replace(/\/$/, "")
const allowedOrigins = (process.env.CORS_ACCESS || "http://localhost:5173")
    .split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean)

const corsOptions = {
    origin(origin, callback) {
        // Requests without an Origin header (health checks, curl, server to
        // server) do not need browser CORS protection.
        if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true)
        }

        return callback(new Error("Origin is not allowed by CORS"))
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

// Register CORS before every parser and route. This also ensures API errors
// retain Access-Control-Allow-Origin instead of appearing as opaque CORS
// failures in Chrome.
app.use(cors(corsOptions))
app.options("*", cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())

// Serve uploaded static files locally
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

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
