module.exports.run = async (client, message, args, _knex, embed) => {
  let user =
    args[1] !== undefined
      ? message.mentions.users.first()
        ? message.mentions.users.first()
        : checkUser(client, args[1])
      : message.author
  embed.setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
  embed.setFooter(user.username + "님의 프로필!")
  message.channel.send(`${message.member}`, { embed: embed })
}

function checkUser(client, user) {
  if (user === undefined) throw new Error("유저 파라미터에 문제가 있습니다.")

  let searchById = client.users.cache.get(user)
  let searchByName = client.users.cache.find((u) => u.username === user)

  if (searchById === undefined) return searchByName
  else return searchById
}
module.exports.help = {
  name: "프로필",
  description: "해당 유저의 프로필을 확인합니다.",
}
