module.exports.run = async (_client, message, args, _knex, embed) => {
  if (args.length < 3)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )

  let words = args.slice(1)
  let random = Math.floor(Math.random() * words.length)

  embed.setDescrpition(`제 선택은 \`${words[random]}\` 이에요!`)
  message.channel.send(`${message.member}`, { embed: embed })
}

module.exports.help = {
  name: "골라",
  description: "여러 단어 중 하나를 선택합니다.",
}
