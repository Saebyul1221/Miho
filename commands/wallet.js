const { comma, checkUser } = require("../utils/functions")
module.exports.run = async (_client, message, _args, knex, embed) => {
  const stocks = await knex("stocks").select("*")
  let member =
    args[1] !== undefined
      ? message.mentions.users.first()
        ? message.mentions.users.first()
        : checkUser(client, message, args[1])
      : message.author
  let user = (await knex("user").where({ id: member.id }))[0]
  let st = {
    sasung: "사성전자",
    kokoa: "코코아",
    miho: "미호전자",
    noname: "무명증권",
  }

  let money = 0
  Object.keys(JSON.parse(user.items)).forEach((el) => {
    money += stocks.find((i) => i.name === el).now * JSON.parse(user.items)[el]
  })
  let items = ""
  Object.keys(JSON.parse(user.items)).forEach((el) => {
    if (JSON.parse(user.items)[el] !== 0)
      items += "\n" + st[el] + ": `" + JSON.parse(user.items)[el] + "` 주"
  })

  embed.setTitle(`${member.username}님의 지갑!\u200b`)
  embed.setDescription(
    `추정 자산: \`${comma(money + Number(user.money))}\`원\u200b`
  )
  embed.addField(
    "현재 주식 정보",
    items.length === 0 ? "보유한 주식이 없어요." : items.replace("\n", "")
  )

  message.channel.send(`${message.member}`, { embed: embed })
}

module.exports.help = {
  name: "지갑",
  description: "현재 보유자산 및 주식을 확인합니다.",
}