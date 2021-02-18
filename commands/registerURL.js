const Hosting = require("../utils/hosting")

module.exports.run = async (client, message, args, knex, _embed) => {
  if (args[1] === undefined)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )
  let host = new Hosting(message, args, knex)
  await host.enrollmentLink(args[1])
}

module.exports.help = {
  name: "링크단축",
  description: "링크를 단축하여 보내줍니다.",
  use: "미호야 링크단축 [URL]",
}
