const { tenor_token } = require("../config/client")
const fetch = require("node-fetch")

module.exports.run = async (_client, message, args, _knex, embed) => {
  if (args[1] === undefined)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )

  let url = `https://api.tenor.com/v1/search?q=${encodeURI(
    args.join(" ")
  )}&key=${tenor_token}&limit=10`

  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      let randomGif = Math.floor(Math.random() * json.results.length)
      let _url = json.results[randomGif]
      if (_url !== undefined) {
        embed.setTitle("검색 결과")
        embed.setURL(_url.url)
        embed.setImage(_url["media"][0]["tinygif"]["url"])
      } else {
        embed.setDescription("검색결과가 없어요!!")
      }
      message.channel.send(`${message.member}`, { embed: embed })
    })
}

module.exports.help = {
  name: "짤",
  description: "검색한 이름의 짤을 검색합니다.",
  use: "미호야 짤 [단어]",
}
