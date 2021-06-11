module.exports.run = async (_client, message, args, knex, embed) => {
  if (args[1] === undefined)
    return message.channel.send(
      `${message.member} ${this.help.use}가 올바른 명령어입니다.`
    )

  if (args[1] === "이미지") {
    let fileHosting = await knex("image").where({ id: message.author.id })
    if (fileHosting.length <= 0)
      return message.channel.send(
        `${message.member} 등록하였던 이미지가 존재하지 않습니다.`
      )

    let str = ""
    fileHosting.map(
      (value) =>
        (str += `${value.image_name} - \`https://whitekj.xyz/type?f=${value.keyword}\`\n`)
    )

    embed.setDescription(str)
    message.channel.send(`${message.member}`, { embed: embed })
  } else if (args[1] === "링크") {
    let urlHosting = await knex("url").where({ id: message.author.id })
    if (urlHosting.length <= 0)
      return message.channel.send(
        `${message.member} 단축하였던 링크가 존재하지 않습니다.`
      )

    let str = ""
    urlHosting.map(
      (value) =>
        (str += `${value.url} - \`https://whitekj.xyz/type?f=${value.keyword}\`\n`)
    )

    embed.setDescription(str)
    message.channel.send(`${message.member}`, { embed: embed })
  }
}

module.exports.help = {
  name: "호스팅",
  description: "등록하였던 링크 혹은 이미지를 확인합니다.",
  use: "미호야 호스팅 [이미지/링크]",
}
