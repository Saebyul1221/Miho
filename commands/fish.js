module.exports.run = async (client, message, args, knex, embed) => {
  let obj = [
    ["병어", 1],
    ["문어", 2],
    ["참치", 2],
    ["우럭", 5],
    ["참돔", 5],
    ["연어", 10],
    ["광어", 10],
    ["고등어", 20],
    ["쓰레기", 40],
    ["꽝", 100],
  ]

  let loss = ""
  let randomFish = (Math.random() * 100).toFixed(1)
  randomFish = parseFloat(randomFish)
  let randomSec = Math.floor(Math.random() * 3) + 1

  for (let value of obj) {
    if (value[1] >= randomFish) {
      loss = value[0]
      break
    }
  }

  embed.setTitle("낚시 결과!")
  loss === "꽝"
    ? embed.setDescription(`앗아.. 낚시를 했지만 아무것도 낚지 못하였다!`)
    : embed.setDescription(`짜라잔~ \`${loss}\` 를 낚았다!`)

  message.channel
    .send(`${message.member} 낚시를 하고 입질을 기다리고 있다...`)
    .then((msg) => {
      setTimeout(() => {
        msg.edit({ content: "앗! 뭔가 잡힌 것 같다!", embed: embed })
      }, randomSec * 1000)
    })
}

module.exports.help = {
  name: "낚시",
  description: "낚시를 합니다.",
}
