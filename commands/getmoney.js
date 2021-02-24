module.exports.run = async (_client, message, _args, knex) => {
  let u = (
    await knex.select("*").from("user").where({ id: message.author.id })
  )[0]
  let m = Number(JSON.parse(u.cooldown).money) || 0
  if (m + 3600 > new Date() / 1000) {
    return message.channel.send(
      `${message.member} 이미 돈을 받으셨어요! 한번 더 받으실려면 \`${(
        Number(m + 3600 - new Date() / 1000) / 60
      ).toFixed(1)}\`분 후에 다시 시도해주세요!`
    )
  } else {
    let cool = JSON.parse(u.cooldown)
    cool.money = Math.round(new Date() / 1000)
    await knex
      .update({
        money: Number(u["money"]) + 100,
        cooldown: JSON.stringify(cool),
      })
      .where({ id: message.author.id })
      .from("user")
    message.channel.send(`${message.member} 100원 드렸어요! 흥행하세요!`)
  }
}

module.exports.help = {
  name: "돈받기",
  description: "100원을 받습니다.",
}
