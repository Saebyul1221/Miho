// 가위바위보
const { MessageEmbed } = require("discord.js")

module.exports.run = async (client, message, args, knex, embed) => {
  if (args[1] === undefined)
    return message.channel.send(
      `${message.member} \`${this.help.use}\`이 올바른 명령어에요!`
    )
  let betAmount = Number(args[1])
  console.log(betAmount)
  let userMoney = (
    await knex("user").select("money").where({ id: message.author.id })
  )[0]

  if (userMoney.length === 0) throw new Error("유저 정보가 존재하지 않습니다.")
  if (betAmount > Number(userMoney.money))
    return message.channel.send(
      `${message.member} 베팅 금액이 보유 자산보다 적어요!\n보유 자산: ${userMoney.money}`
    )

  embed.setDescription(`
베팅 금액: ${betAmount}
미호를 상대로 **이길 시 3배!**

아래 반응을 추가하여 게임을 진행하세요.
`)
  embed.addField("1️⃣", "가위", true)
  embed.addField("2️⃣", "바위", true)
  embed.addField("3️⃣", "보", true)
  let weapons = {
    rock: { wins: ["scissors"] },
    paper: { wins: ["rock"] },
    scissors: { wins: ["paper"] },
  }
  let weaponKeys = Object.keys(weapons)
  let getRandomWeapon = () => {
    return weaponKeys[(weaponKeys.length * Math.random()) << 0]
  }
  let getWinner = (weapon1, weapon2) => {
    if (weapon1 === weapon2) return 0
    return weapons[weapon1].wins.some((wins) => wins === weapon2) ? 1 : 2
  }
  let botweapon = getRandomWeapon()
  let userweapon = {
    "1️⃣": "scissors",
    "2️⃣": "rock",
    "3️⃣": "paper",
  }
  let filter = (reaction, user) =>
    (reaction.emoji.name === "1️⃣" ||
      reaction.emoji.name === "2️⃣" ||
      reaction.emoji.name === "3️⃣") &&
    user.id === message.author.id
  message.channel.send(`${message.member}`, { embed: embed }).then((msg) => {
    msg.react("1️⃣")
    msg.react("2️⃣")
    msg.react("3️⃣")
    msg
      .awaitReactions(filter, {
        max: 1,
      })
      .then(async (collected) => {
        let choose = userweapon[collected.array()[0].emoji.name]
        let result = getWinner(botweapon, choose)
        let resultEmbed = new MessageEmbed()
        console.log("BOT: ", botweapon)
        console.log("USER: ", choose)
        console.log("RESULT:", result)
        let output = `
베팅 금액: ${betAmount}
미호를 상대로 **이길 시 3배!**

`
        if (result === 0) {
          output += "얻은 금액: 0원 | 원금 회수"
          console.log("DRAW")
          resultEmbed
            .setColor("GREEN")
            .setTitle("비겼습니다.")
            .setDescription(output)
            .setFooter(`${message.author.tag}`, message.author.avatarURL())
          message.channel.send(`${message.member}`, { embed: resultEmbed })
        }
        if (result === 1) {
          output += `잃은 금액: ${betAmount}원`
          resultEmbed
            .setColor("RED")
            .setTitle("졌습니다.")
            .setDescription(output)
            .setFooter(`${message.author.tag}`, message.author.avatarURL())
          message.channel.send(`${message.member}`, { embed: resultEmbed })
          await updateMoney(
            message.author.id,
            userMoney.money,
            knex,
            betAmount,
            "lose"
          )
        }
        if (result === 2) {
          output += `얻은 금액: ${Number(betAmount) * 3}원`
          resultEmbed
            .setColor("BLUE")
            .setTitle("이겼습니다!")
            .setDescription(output)
            .setFooter(`${message.author.tag}`, message.author.avatarURL())
          message.channel.send(`${message.member}`, { embed: resultEmbed })
          await updateMoney(
            message.author.id,
            userMoney.money,
            knex,
            betAmount,
            "win"
          )
        }
      })
      .catch((err) => new Error(err))
  })
}

async function updateMoney(userid, userMoney, knex, bet, status) {
  if (status === "lose") {
    let lost = Number(userMoney) - Number(bet)
    console.log("lose - function", lost)
    await knex("user").update({ money: lost }).where({ id: userid })
  }
  if (status === "win") {
    let get = Number(userMoney) + Number(bet) * 3
    console.log("win - function", get)
    await knex("user").update({ money: get }).where({ id: userid })
  }
}
module.exports.help = {
  name: "가위바위보",
  description: "봇이랑 가위바위보를 합니다.",
  use: "미호야 가위바위보 [배팅금액]",
}
