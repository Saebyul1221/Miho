const { owners } = require("../config/client")

module.exports.run = async (client, message, args, knex, embed) => {
  if (owners.some((oid) => message.author.id.includes(oid))) {
    try {
      let text = args.slice(1).join(" ")

      if (text.indexOf("exit") != -1 && text.indexOf("process") != -1) {
        embed.setTitle("오류!")
        embed.setDescription("`process.exit()` 함수는 이용할 수 없습니다!")
        message.channel.send(`${message.member}`, { embed: embed })
      } else {
        const result = new Promise((resolve) => resolve(eval(text)))
        return result
          .then((output) => {
            if (typeof output !== "string")
              output = require("util").inspect(output, {
                depth: 0,
              })

            if (output.includes(client.token))
              output = output.replace(client.token, "토큰")
            if (output.length > 1010) output = output.slice(0, 1010) + "\n..."
            embed.setDescription(
              "입력 :\n```js\n" +
                text +
                "\n```\n출력 :```js\n" +
                output +
                "\n```"
            )
            message.channel.send(`${message.member}`, { embed: embed })
          })
          .catch((error) => {
            console.error(error)
            error = error.toString()
            error = error.replace(client.token, "토큰")

            if (error.includes(client.token))
              error = error.replace(client.token, "토큰")
            embed.setTitle("오류!")
            embed.setDescription(`
\`\`\`js
${error}
\`\`\`
`)
            message.channel.send(`${message.member}`, { embed: embed })
          })
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    message.channel.send(
      `${message.member} 해당 명령어는 봇 관리자만 쓸 수 있어요!`
    )
  }
}

module.exports.help = {
  name: "실행",
  description: "작성한 코드를 실행합니다.",
}
