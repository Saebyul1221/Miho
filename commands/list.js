const { MessageEmbed } = require("discord.js")

module.exports.run = async (_client, message, _args, knex, _embed) => {
  let array = await pushArray(knex)
  let currentPages = 0

  const m = await message.channel.send({ embed: array[currentPages] })
  await m.react("⬅")
  await m.react("➡")
  await m.react("🗑")

  const filter = (reaction, user) => {
    return (
      ["⬅", "➡", "🗑"].includes(reaction.emoji.name) &&
      user.id == message.author.id
    )
  }

  const removeReaction = async (m, msg, emoji) => {
    try {
      m.reactions.cache
        .find((r) => r.emoji.name == emoji)
        .users.remove(msg.author.id)
    } catch (err) {}
  }

  const awaitReactions = async (msg, m, filter) => {
    m.awaitReactions(filter, { max: 1, time: 15 * 1000, errors: ["time"] })
      .then(async (collected) => {
        const reaction = collected.first()
        if (reaction.emoji.name === "⬅") {
          await removeReaction(m, msg, "⬅")

          if (currentPages !== 0) {
            currentPages = currentPages - 1
            await m.edit({ embed: array[currentPages] })
          }
          awaitReactions(msg, m, filter)
        } else if (reaction.emoji.name === "➡") {
          await removeReaction(m, msg, "➡")

          if (currentPages !== array.length) {
            currentPages += 1
            await m.edit({ embed: array[currentPages] })
          }
          awaitReactions(msg, m, filter)
        } else if (reaction.emoji.name === "🗑") {
          await m.delete()
        }
      })
      .catch(() => {})
  }

  awaitReactions(message, m, filter)
}

async function pushArray(knex) {
  let data = await knex("custom")
  let stopLoop = Math.floor(data.length / 5)
  let pleasestop = stopLoop + 1
  let _array = []
  let words = []
  let loop = 0
  let remainder = data.length - (data.length % 5)
  let lastLoop = data.length % 5

  for (let i = 0; i < pleasestop; i++) _array.push(new MessageEmbed())

  for (let i = 0; i < data.length; i++)
    words.push({ title: data[i].title, description: data[i].description+"\u200b" })

  for (let i = 0; i < stopLoop; i++) {
    for (let j = 0; j < 5; j++) {
      if (loop === remainder) break
      _array[i].addField(
        words.slice(loop)[0].title,
        words.slice(loop)[0].description
      )
      _array[i].setFooter(`현재 페이지: ${i + 1}/${stopLoop + 1}`)
      _array[i].setTimestamp(new Date())
      _array[i].setColor("#FFB0CF")
      loop += 1
    }
  }

  if (loop === remainder) {
    for (let i = 0; i < lastLoop; i++) {
      _array[pleasestop - 1].addField(
        words.slice(loop)[0].title,
        words.slice(loop)[0].description
      )
      _array[pleasestop - 1].setFooter(
        `현재 페이지: ${stopLoop + 1}/${pleasestop}`
      )
      _array[pleasestop - 1].setTimestamp(new Date())
      _array[pleasestop - 1].setColor("#FFB0CF")
      loop += 1
    }
  }

  return _array
}

module.exports.help = {
  name: "학습목록",
  description: "학습한 목록을 출력합니다.",
}
