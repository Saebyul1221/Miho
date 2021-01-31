const express = require("express")
const app = express()
const path = require("path")
const viewsPath = path.join(__dirname, "./views")

let port = require("./config.json").port || 80
app.set("port", port)
app.set("views", viewsPath)

const session = require("express-session")

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/static"))
app.use(
  session({
    secret: "48738924783748273742398747238",
    resave: false,
    saveUninitialized: false,
    expires: 604800000,
  })
)
require("./router")(app)

app.listen(port, () => console.info(`Listening on port ${port}`))
