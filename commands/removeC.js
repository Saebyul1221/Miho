module.exports.run = async (client, message, args, knex, embed) => {
  if (args[1] === undefined)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )
  let data = (
    await knex("custom").where({
      title: args[1],
      author: message.author.id
    })
  )[0]

  if (data?.author === message.author.id) {
    await knex("custom")
      .where({ title: args[1], author: message.author.id })
      .del()

    let replyArray = [
      `${message.member} \`${args[1]}\` 라는 단어를 잊었어요! 내용은.. 뭐였더라?`,
      `${message.member} \`${args[1]}\` 를 지웠어요! 엥.. 잠시만 월래 있던건가?`,
      `${message.member} \`${args[1]}\` 를 지웠는데 월래 내용이 기억이 안나서 찝찝해요..`,
    ]

    let RanInt = Math.floor(Math.random() * replyArray.length)
    message.channel.send(replyArray[RanInt])
  } else {
    message.channel.send(
      `${message.member} 자신이 학습시킨 단어만 지울 수 있어요!`
    )
  }
}

module.exports.help = {
  name: "잊어",
  description: "학습시킨 단어를 지웁니다.",
  use: "미호야 잊어 [단어]",
}
