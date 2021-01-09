module.exports.run = async (client, message, _, knex, embed) => {
  if ((await knex("user").where({ id: message.author.id })).length > 0) {
    return message.channel.send(
      `${message.member}님은 이미 ${client.user.username}의 서비스에 가입하셨어요!`
    )
  } else {
    embed.setDescription(`
${client.user.username}의 명령어를 이용하실려면 먼저 이용약관에 동의하셔야해요!

만약에 아래 이용악관에 동의하신다면 \`동의합니다\` 를 입력해주세요!
    `)
    embed.addField("이용약관", "준비 중이에요!", true)
    embed.addField("개인정보처리방침", "이것도 준비 중이에요!", true)
    const filter = (m) =>
      m.content === "동의합니다" && m.author.id === message.author.id

    await message.channel.send(`${message.member}`, { embed: embed })
    message.channel
      .awaitMessages(filter, {
        max: 1,
        time: 10000,
        errors: ["time"],
      })
      .then(async (collected) => {
        // console.log(collected.array()[0])
        // if (!collected) {
        //   await message.channel.send(
        //     `${message.member} 시간이 초과되어서 취소되었어요!`
        //   )
        // }
        if (collected.array()[0].content === "동의합니다") {
          await knex
            .insert({ id: message.author.id, favorite: "0" })
            .from("user")
          return message.channel.send(`
${message.member} 가입되었습니다! 이제 ${client.user.username}의 모든 기능을 사용하실 수 있어요!
          `)
        }
      })
      .catch(async (collected) => {
        await message.channel.send(
          `${message.member} 시간이 초과되어서 취소되었어요!`
        )
      })
  }
}

module.exports.help = {
  name: "가입",
  description: "미호 서비스에 가입합니다.",
}
