const { MessageEmbed } = require("discord.js")

module.exports.run = async (_client, message, _args, _knex, _embed) => {
  message.channel.send()
}

module.exports.help = {
  name: "학습목록",
  description: "학습한 목록을 출력합니다.",
}
