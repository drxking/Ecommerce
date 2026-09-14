let http = require("http")
let app = require("./app")

let port = process.env.PORT || 3000;


const server = http.createServer(app)


server.listen(port,()=>{
    console.log(`Server Listening on Port ${port}`)
})
