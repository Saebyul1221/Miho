const path = require("path")
const viewsPath = path.join(__dirname, "../views")
const express = require("express")
const app = express()

app.use(express.static(__dirname + "/public"))
app.set("views", viewsPath)
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")

app.get("/", require("./list"))

app.listen(80, () => {
  console.log("Connected")
})
