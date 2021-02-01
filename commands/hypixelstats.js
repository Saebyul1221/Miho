const { hypixel_token: token } = require("../config/client")
const fetch = require("node-fetch")

module.exports.run = async (_client, message, args, _knex, embed) => {
  if (args[1] === undefined)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )

  let url = `https://api.hypixel.net/player?key=${token}&name=${encodeURI(
    args[1]
  )}`

  fetch(url)
    .then((res) => res.json())
    .then((json) => sendResult(message, args[1], embed, json))
}

function sendResult(message, user, embed, data) {
  if (data.player?.stats !== undefined) {
    let rank =
      data.player.rank !== undefined
        ? data.player.newPackageRank !== undefined
          ? "없음"
          : data.player.newPackageRank
        : data.player.newPackageRank
    let skywars = data.player.stats.SkyWars
    let bedwars = data.player.stats.Bedwars
    let karma = data.player.karma
    let mostPlay = data.player.mostRecentGameType
    embed.setTitle(`${user}님의 하이픽셀 정보`)
    embed.addField("랭크", rank, true)
    embed.addField("카르마", karma, true)
    embed.addField("가장 많이 플레이한 게임", mostPlay, true)
    embed.addField(
      "스카이워즈",
      `
  코인: ${skywars.coins}
  레벨: ${skywars.levelFormatted.replace("§", "")}
  영혼: ${skywars.souls}
    `,
      true
    )
    embed.addField(
      "배드워즈",
      `
  코인: ${bedwars.coins}
  레벨: ${data.player.achievements.bedwars_level}
  
  이긴 횟수: ${bedwars.wins_bedwars}
  패배 횟수: ${bedwars.losses_bedwars}
  
  현재 연승: ${bedwars.winstreak}
  
  킬 수: ${bedwars.kills_bedwars}
  사망 횟수: ${bedwars.deaths_bedwars}
    `,
      true
    )

    message.channel.send(`${message.member}`, { embed: embed })
  } else {
    embed.setDescription(`${user}님의 하이픽셀 정보가 존재하지 않습니다.`)
    message.channel.send(`${message.member}`, { embed: embed })
  }
}
module.exports.help = {
  name: "하픽스텟",
  description: "해당 유저의 하이픽셀 스텟을 확인합니다.",
  use: "미호야 하픽스텟 [유저이름]",
}
