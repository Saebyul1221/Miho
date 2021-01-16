const embed = require("../utils/embed")

module.exports.run = async (_client, message, _args, knex, embed) => {
  let data = await knex("stocks").select("*")
  let stocks = ""

  for (let i = 0; i < data.length; i++) {
    let price = data[i].prices.replace("[", "").replace("]", "") // 변동 후 값
    let before = data[i].lastchange // 변동 전 값

    let result = parseInt(before) - Number(price)

    result <= 0
      ? (stocks += `+ ${data[i].name} : ${data[i].now} (${String(
          result
        ).replace("-", "+")})\n`)
      : (stocks += `- ${data[i].name} : ${data[i].now} (-${result})\n`)
  }

  embed.addField(
    "현재 주식 상태",
    `
\`\`\`diff
${stocks}
\`\`\`
  `
  )

  message.channel.send(`${message.member}`, { embed: embed })
}

module.exports.help = {
  name: "주식",
  description: "현재 주식 현황을 확인합니다.",
}
