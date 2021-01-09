module.exports.run = async (client, message, _args, _knex, embed) => {
  const commandDir = require("./")

  embed.setDescription(`${client.user.username}의 도움말이에요!`)
  for (const [key, value] of Object.entries(commandDir)) {
    embed.addField(
      "미호야 " + value.help.name,
      value.help.description + "\u200b"
    )
  }

  message.channel.send(`${message.member}`, { embed: embed })
}

module.exports.help = {
  name: "도움",
  description: "봇의 도움말을 출력합니다.",
}
