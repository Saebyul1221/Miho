
function find(str) {
    var s = [
      { id: "sasung", name: "사성전자", alias: "사성" },
      { id: "kokoa", name: "코코아", alias: "코코" },
      { id: "miho", name: "미호전자", alias: "미호" },
      { id: "noname", name: "무명증권", alias: "무명" },
    ]
    return s.filter((r) => r.id.includes(str) || r.name.includes(str))
  }

  function apply(message, embed, knex, data, Dtitle, Ddescription) {
    let replyArray = [
      `\`${Dtitle}\`은 \`${Ddescription}\`이라고요? 고마워요! ${message.member}님!`,
      `아하! \`${Dtitle}\`는 \`${Ddescription}\`이군요! 고마워요! ${message.member}님!`,
      `메..모.. \`${Dtitle}\`는 \`${Ddescription}\`이다.. 알려주셔서 고마워요! ${message.member}님!`,
    ]
    let RanInt = Math.floor(Math.random() * replyArray.length)
  
    let filter = (reaction, user) =>
      (reaction.emoji.id === "659355468715786262" ||
        reaction.emoji.id === "659355468816187405") &&
      user.id === message.author.id
    embed.setDescription(`
  \`${Dtitle}\`를 \`${Ddescription}\`라고 학습 시키겠습니까?
      
  부적절한 언사 및 관리자의 판단하에 올바르지 않다고 판단될 시
  제제될 수 있습니다. 동의한다면 아래 <:cs_yes:659355468715786262> 반응을 눌러주세요!
  `)
    message.channel
      .send(`${message.member}`, { embed: embed })
      .then(async (msg) => {
        msg.react("659355468715786262")
        msg.react("659355468816187405")
        msg
          .awaitReactions(filter, {
            max: 1,
            time: 10000,
            errors: ["time"],
          })
          .then(async (collected) => {
            if (collected.array()[0].emoji.id === "659355468715786262") {
              if (data?.author !== undefined) {
                await knex("custom")
                  .where({ title: Dtitle, author: message.author.id })
                  .update({ description: Ddescription })
  
                msg.delete()
                message.channel.send(replyArray[RanInt])
              } else if (data?.author === undefined) {
                await knex("custom").insert({
                  author: message.author.id,
                  title: Dtitle,
                  description: Ddescription,
                })
                msg.delete()
                message.channel.send(replyArray[RanInt])
              }
            } else {
              msg.delete()
              message.channel.send(`${message.member} 학습을 취소했어요!`)
            }
          })
          .catch(() => {
            msg.delete()
            message.channel.send(
              `${message.member} 시간이 초과되어 학습을 취소했어요!`
            )
          })
      })
  }

  
function sendResult(message, args, embed) {
    const fetch = require("node-fetch")
    let url = `https://api.tenor.com/v1/search?q=${encodeURI(
      args.slice(1).join(" ")
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

function checkUser(client, message, user) {
  let searchById = client.users.cache.get(user)
  let searchByName = message.guild.members.cache.find(
    (u) => u.displayName === user
  )
  if (
    user === undefined ||
    (searchById === undefined && searchByName === undefined)
  )
    throw new Error(
      '유저 파라미터에 문제가 있습니다.\n존재하지 않는 유저일 수 있습니다.\n유저 검색은 "서버 내 이름"을 기준으로 합니다.'
    )

  if (searchById === undefined) return searchByName.user
  else return searchById
}


module.exports.comma = comma
module.exports.checkUser = checkUser
module.exports.find = find
module.exports.apply = apply
module.exports.sendResult = sendResult