const Hosting = require("../utils/hosting")

module.exports.run = async (client, message, args, knex, _embed) => {
  const filter = (m) => m.content === ""
  message.channel.send(`${message.member} 등록할 이미지를 업로드해주세요!`)
  message.channel
    .awaitMessages(filter, {
      max: 1,
      time: 10000,
      errors: ["time"],
    })
    .then(async (collected) => {
      if (collected.array()[0].attachments.first()) {
        let host = new Hosting(message, args, knex)
        await host.enrollmentFile(collected.array()[0].attachments.first())
      }
    })
    .catch(async (collected) => {
      message.channel.send(
        `${message.member} 오류가 발생했습니다. 시간이 초과했거나 서버 문제입니다.`
      )
    })
}

module.exports.help = {
  name: "이미지",
  description: "업로드한 이미지를 주소로 변환합니다.",
  use: "미호야 이미지 (입력한 후 이미지를 첨부파일로 올리세요.)",
}
