const config = require("./config")
const Discord = require("discord.js")
const client = new Discord.Client(config.client.bot)
client.commands = new Discord.Collection()
const knex = require("knex")(config.database)
const fs = require("fs")

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
client.on("ready", () => {
  console.log("=".repeat(40))
  console.log(
    `${client.user.username}#${client.user.discriminator} IS READY!\n\n전체 유저 수: ${client.users.cache.size}`
  )
  console.log("=".repeat(40))
})

client.on("message", async (message) => {
  if (message.author.bot || !message.guild) return
  if (!message.content.startsWith(config.client.prefix)) return

  let embed = require("./utils/embed")(message)

  const black = (await knex("blacklist").where({ id: message.author.id }))[0]
  if (black?.id !== undefined) {
    let moderator = client.users.cache.get(black.admin)
    embed.setDescription(`
앗, ${message.member}님은 ${client.user.username} 사용이 제한되셨어요!

차단 사유: ${black.reason}
차단 시각: ${black.date}
담당관리자: ${moderator.username}#${moderator.discriminator}
    `)
    return message.channel.send(`${message.member}`, { embed: embed })
  }

  let registerCommand = client.commands.get("가입")
  let msg = message.content.split(" ")
  let args = msg.slice(1)
  let customCommand
  args[0] !== undefined
    ? (customCommand = (await knex("custom").where({ title: args[0] }))[0])
    : undefined

  if (customCommand?.title !== undefined)
    return message.channel.send(`
${customCommand.description}

\`${client.users.cache.get(customCommand.author).username}#${
      client.users.cache.get(customCommand.author).discriminator
    }\` 님이 알려주셨어요!
`)
  const user = (await knex("user").where({ id: message.author.id }))[0]
  if (!user) return registerCommand.run(client, message, args, knex, embed)

  let commandFile = client.commands.get(args[0])
  if (commandFile) commandFile.run(client, message, args, knex, embed)
})

client.login(config.client.token)
