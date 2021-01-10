const config = require("./config")
const Discord = require("discord.js")
const client = new Discord.Client(config.client.bot)
client.commands = new Discord.Collection()
const fs = require("fs")
require("./utils/eventLoader")(client)

fs.readdir("./commands/", (error, files) => {
  if (error) return console.log(error)

  let jsfile = files.filter(
    (f) => f.split(".").pop() === "js" && f.split(".")[0] !== "index"
  )
  if (jsfile.length <= 0) return console.log("명령어들을 찾지 못했어요..")

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`)
    client.commands.set(props.help.name, props)
  })
})

client.login(config.client.token)
