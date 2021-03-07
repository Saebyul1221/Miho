const { tenor_token, ignore_nsfw_tag } = require("../config/client")
const { sendResult } = require("../utils/functions")

module.exports.run = async (_client, message, args, _knex, embed) => {
  if (args[1] === undefined)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )

  !message.channel.nsfw &&
  ignore_nsfw_tag.some((word) => args.slice(1).join(" ").includes(word))
    ? message.channel.send(
        `${message.member} 성적인 단어가 포함된 키워드는 NSFW 채널에서만 사용하실 수 있어요!`
      )
    : sendResult(message, args, embed)
}

module.exports.help = {
  name: "짤",
  description: "검색한 이름의 짤을 검색합니다.",
  use: "미호야 짤 [단어]",
}