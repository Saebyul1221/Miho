const { apply } = require("../utils/functions")
module.exports.run = async (client, message, args, knex, embed) => {
  if (args.length < 3)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )

  let commandDir = require("./")
  let commands = []
  for (const [, value] of Object.entries(commandDir)) {
    commands.push(value.help.name)
  }

  let regExp = /[\\{}\\[\]\\/?.,;:|\\)*~`!^\-_+<>@\\#$%&\\\\=\\(\\'\\"]/gi
  let _arg = args[1].replace(regExp, "")

  if (commands.includes(_arg))
    return message.channel.send(
      `${message.member} 봇 명령어와 겹치는 단어는 사용하실 수 없어요!`
    )
  let replyMsg = args
    .slice(2)
    .join(" ")
    .replaceAll("@everyone", "에브리원")
    .replaceAll("@here", "히얼")

  let data = (
    await knex("custom").where({
      author: message.author.id,
      title: args[1],
    })
  )[0]

  apply(message, embed, knex, data, args[1], replyMsg)
}

module.exports.help = {
  name: "배워",
  description: "단어를 봇에게 학습시킵니다.",
  use: "미호야 배워 [단어] [답장할 내용]",
}
