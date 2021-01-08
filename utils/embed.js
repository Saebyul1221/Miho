const Discord = require("discord.js")

module.exports = (message) => {
  const embed = new Discord.MessageEmbed()
  embed.setFooter(`${message.author.tag}`, message.author.avatarURL())
  embed.setTimestamp(new Date())
  embed.setColor("#FFB0CF")
  return embed
}
