const config = require("./config")
const Discord = require("discord.js")
const cron = require("node-cron")
const client = new Discord.Client(config.client.bot)
client.commands = new Discord.Collection()
const knex = require("knex")(config.database)
const Stocks = require("./utils/Stocks.js")
const Stock = new Stocks(knex)
const fs = require("fs")
const data = {
  register: [],
  cooldown: {},
  action: [],
}
require("./web/app") // Web

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

  cron.schedule("*/10 * * * *", async function () {
    await Stock.update()
  })
})

// SHAKE CARROT

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
  let customCommand =
    args[0] !== undefined
      ? await knex("custom").where({ title: args[0] })
      : undefined

  const user = (await knex("user").where({ id: message.author.id }))[0]
  if (!user) return registerCommand.run(client, message, args, knex, embed)

  let size = customCommand.length
  let RanInt = Math.floor(Math.random() * size)

  if (customCommand[RanInt]?.title !== undefined) {
    let replaceObj = {
      "{멘션}": message.member,
      "{아이디}": message.author.id,
      "{닉네임}": message.member.displayName,
    }

    let sendCommand = customCommand[RanInt]?.description

    for (let [key, value] of Object.entries(replaceObj)) {
      sendCommand = sendCommand.replaceAll(key, value)
    }

    return message.channel.send(`
${sendCommand}

\`${client.users.cache.get(customCommand[RanInt].author)?.username}#${
      client.users.cache.get(customCommand[RanInt].author)?.discriminator
    }\` 님이 알려주셨어요!
`)
  }

  if (user.action)
    return message.channel.send(
      `${message.member} 이미 진행중인 작업이 있어요!`
    )

  if (
    data.cooldown[message.author.id] &&
    Number(data.cooldown[message.author.id]) > Number(new Date())
  ) {
    let time = Number(
      (Number(data.cooldown[message.author.id]) - Number(new Date())) / 1000
    ).toFixed(2)

    embed.setDescription(
      `해당 명령어를 사용하시기 위해선 \`${time}\`초를 더 기다리셔야해요!`
    )
    return message.channel.send(`${message.member}`, { embed: embed })
  }
  data.cooldown[message.author.id] = new Date(Number(new Date()) + 2000)

  let commandFile = client.commands.get(args[0])
  if (commandFile) {
    commandFile.run(client, message, args, knex, embed, data).catch((error) => {
      knex("user")
        .where({ action: 1, id: message.author.id })
        .update({ action: 0 })

      console.error(error)

      let errorMsg = [
        "아야... 분주하게 명령어를 실행하다가 넘어져서 명령을 실행할 수 없었어요..ㅠ\n오류 내용은 이래요.",
        "미야라는 친구의 하소연을 듣다가 명령어를 까먹어서 실행하지 못했어요..\n오류 내용은 이래요.",
        "Chip_ 이 부르는 노래를 듣다가 너무 못 불러서 고막이 다쳐서 명령어를 실행하지 못했어요..\n오류 내용은 이래요.",
        "엥..헐? 어떤 명령어를 요청하셨는데 갑자기 아무것도 기억이 안나요!! 죄송해요..\n오류 내용은 이래요.",
      ]
      let random = Math.floor(Math.random() * errorMsg.length)
      embed.addField(
        errorMsg[random],
        `\`\`\`js
${error}
\`\`\``
      )

      message.channel.send(`${message.member}`, { embed: embed })
    })
  }
})
client.login(config.client.token)
