module.exports.run = async (client, message, args, knex) => {
  const stocks = await knex("stocks").select("*")
  let rank = `
총 보유 자산 TOP10 입니다.
\`\`\`md

`
  let user = await knex("user")
  let users = []
  for (let i = 0; i < user.length; i++) {
    let money = 0
    Object.keys(JSON.parse(user[i].items)).forEach((el) => {
      money +=
        stocks.find((i) => i.name === el).now * JSON.parse(user[i].items)[el]
    })
    money += user[i].money
    users.push({ id: user[i].id, money: money })
  }

  users = users
    .sort(function (a, b) {
      return a.money < b.money ? -1 : a.money > b.money ? 1 : 0
    })
    .reverse()
  for (let i = 0; i < 10; i++) {
    let username =
      client.users.cache.get(users[i].id)?.username || "알 수 없는 유저"
    rank += `${i + 1}. ${username} - ${comma(users[i].money)}원\n`
  }

  rank += "```"

  message.channel.send(`${message.member}\n${rank}`)
}

function comma(num) {
  let len, point, str

  num = num + ""
  point = num.length % 3
  len = num.length

  str = num.substring(0, point)
  while (point < len) {
    if (str != "") str += ","
    str += num.substring(point, point + 3)
    point += 3
  }

  return str
}

module.exports.help = {
  name: "랭킹",
  description: "총 자산 TOP 10을 봅니다.",
}
