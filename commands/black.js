const { owners } = require("../config/client")

module.exports.run = async (client, message, args, knex, embed) => {
  if (owners.some((oid) => message.author.id.includes(oid))) {
    if (args.length <= 2)
      return message.channel.send(
        `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
      )
    if (args[1] === "추가") {
      await knex("blacklist").insert({
        id: args[2],
        date: new Intl.DateTimeFormat("kr", {
          dateStyle: "long",
          timeStyle: "short",
        }).format(Date.now()),
        admin: message.author.id,
        reason: args.slice(3).join(" "),
      })
      message.channel.send(
        `${message.member} ${args[2]} ID를 블랙리스트에 추가했어요!`
      )
    } else if (args[1] === "제거") {
      let userData = (await knex("blacklist").where({ id: args[2] }))[0]
      if (userData?.id !== undefined) {
        await knex("blacklist").where({ id: args[2] }).del()
        message.channel.send(
          `${message.member} ${args[2]} ID를 블랙리스트에서 제거했어요!`
        )
      }
    }
  }
}

module.exports.help = {
  name: "블랙",
  description: "특정 유저를 블랙리스트에 추가합니다.",
  use: "미호야 블랙 [추가/제거] [유저] [사유]",
}
