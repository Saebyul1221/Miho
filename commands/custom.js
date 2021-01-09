module.exports.run = async (client, message, args, knex, embed) => {
  if (args.length < 1)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )

  let replyMsg = args.slice(2).join(" ")

  let data = (
    await knex("custom").where({
      author: message.author.id,
      title: args[1],
    })
  )[0]

  apply(message, embed, knex, data, args[1], replyMsg)
}

function apply(message, embed, knex, data, Dtitle, Ddescription) {
  let filter = (reaction, user) =>
    (reaction.emoji.id === "659355468715786262" ||
      reaction.emoji.id === "659355468816187405") &&
    user.id === message.author.id
  embed.setDescription(`
\`${Dtitle}\`를 \`${Ddescription}\`라고 학습 시키겠습니까?
    
부적절한 언사 및 관리자의 판단하에 올바르지 않다고 판단될 시
제제될 수 있습니다. 동의한다면 아래 <:cs_yes:659355468715786262> 반응을 눌러주세요!
`)
  message.channel.send(`${message.member}`, { embed: embed }).then((msg) => {
    msg.react("659355468715786262")
    msg.react("659355468816187405")
    msg
      .awaitReactions(filter, {
        max: 1,
        time: 10000,
        errors: ["time"],
      })
      .then(async (collected) => {
        if (collected.array()[0].emoji.id === "659355468715786262") {
          if (data?.author !== undefined) {
            await knex("custom")
              .where({ title: Dtitle })
              .update({ description: Ddescription })

            msg.delete()
            message.channel.send(
              `\`${Dtitle}\`은 \`${Ddescription}\`이라고요? 고마워요! ${message.member}님!`
            )
          } else if (data?.author === undefined) {
            await knex("custom").insert({
              author: message.author.id,
              title: Dtitle,
              description: Ddescription,
            })
            msg.delete()
            message.channel.send(
              `\`${Dtitle}\`은 \`${Ddescription}\`이라고요? 고마워요! ${message.member}님!`
            )
          }
        } else {
          msg.delete()
          message.channel.send(`${message.member} 학습을 취소했어요!`)
        }
      })
      .catch((_) => {
        msg.delete()
        message.channel.send(
          `${message.member} 시간이 초과되어 학습을 취소했어요!`
        )
      })
  })
}
module.exports.help = {
  name: "배워",
  description: "단어를 봇에게 학습시킵니다.",
  use: "미호야 배워 [단어] [답장할 내용]",
}
