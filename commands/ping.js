module.exports.run = async (client, message, _, knex, embed) => {
  message.channel.send("측정 중 입니다...").then((m) => {
    const time = new Date()
    knex("user")
      .select("*")
      .limit(1)
      .then(() => {
        embed.addField(
          `현재 ${client.user.username}의 핑이에요!`,
          `
\u200b
봇 지연시간: \`${m.createdTimestamp - message.createdTimestamp}ms\`
API 지연시간: \`${client.ws.ping}ms\`
DB 지연시간: \`${new Date() - time}ms\`
      `
        )
        m.edit({ content: `${message.member}`, embed })
      })
  })
}

module.exports.help = {
  name: "핑",
  description: "봇의 핑을 출력합니다.",
}
