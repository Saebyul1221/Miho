module.exports.run = async (client, message, _args, _knex, embed) => {
  embed.setDescription(
    `${client.user.username}의 학습 목록은 [여기서](http://urtica.xyz/list) 확인하실 수 있어요!`
  )

  message.channel.send(`${message.member}`, { embed: embed })
}

module.exports.help = {
  name: "학습목록",
  description: "학습한 목록을 출력합니다.",
}
