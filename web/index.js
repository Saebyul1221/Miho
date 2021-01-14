const express = require("express")
const app = express()
app.use(express.static("public"))
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")

app.get("/", require("./list"))

app.listen(80, () => {
  console.log("Connected")
})
