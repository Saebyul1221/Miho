module.exports.run = async (client, message, args, _knex, embed) => {
  let user =
    args[1] !== undefined
      ? message.mentions.users.first()
        ? message.mentions.users.first()
        : checkUser(client, message, args[1])
      : message.author
  embed.setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
  embed.setFooter(user.username + "님의 프로필!")
  message.channel.send(`${message.member}`, { embed: embed })
}

function checkUser(client, message, user) {
  let searchById = client.users.cache.get(user)
  let searchByName = message.guild.members.cache.find(
    (u) => u.displayName === user
  )

  if (
    user === undefined ||
    (searchById === undefined && searchByName === undefined)
  )
    throw new Error(
      '유저 파라미터에 문제가 있습니다.\n존재하지 않는 유저일 수 있습니다.\n유저 검색은 "서버 내 이름"을 기준으로 합니다.'
    )

  if (searchById === undefined) return searchByName.user
  else return searchById
}

module.exports.help = {
  name: "프로필",
  description: "해당 유저의 프로필을 확인합니다.",
}
