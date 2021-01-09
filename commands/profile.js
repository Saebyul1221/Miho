module.exports.run = async (client, message, args, _knex, embed) => {
  let user =
    args[1] !== undefined
      ? message.mentions.users.first()
        ? message.mentions.users.first()
        : client.users.cache.get(args[1])
      : message.author

  if (!user) {
    embed.setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
    embed.setFooter(user.username + "님의 프로필!")
    message.channel.send(`${message.member}`, { embed: embed })
  }
  embed.setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
  embed.setFooter(user.username + "님의 프로필!")
  message.channel.send(`${message.member}`, { embed: embed })
}

module.exports.help = {
  name: "프로필",
  description: "해당 유저의 프로필을 확인합니다.",
}
