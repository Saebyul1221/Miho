// 알고싶어. 너의 R.G.B 값
module.exports.run = async (_client, message, args, _knex, embed) => {
  if (args[1] === undefined)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )

  embed.setColor(args[1])
  embed.setDescription(
    `좌측에 표시된 색의 입력하신 \`#${args[1]}\` 의 색입니다.
    올바르지 않은 HEX를 입력하였을 경우 검은색으로 표시됩니다.`
  )

  message.channel.send(`${message.member}`, { embed: embed })
}

module.exports.help = {
  name: "색코드",
  description: "입력한 색코드의 색을 보여드립니다.",
  use: "미호야 색코드 [HEX]",
}
