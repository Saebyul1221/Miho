module.exports = (app) => {
  // '/'
  app.use("/", require("./routes/index.js"))

  // '/authorize'
  app.use("/authorize", require("./routes/discord"))
}
