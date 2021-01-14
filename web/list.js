const express = require("express")
const router = express.Router()
const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("../config")
const knex = require("knex")(config.database)

router.get("/", async function (_req, res) {
  let posts = await knex("custom").select("*")
  let test = client.user?.username

  let dontdothat = [
    "잠시 후에 다시 시도해주세요.",
    "에헤이 이 사람아. 이렇게 성급해서 쓰나. 조금만 더 기다렸다가 다시 시도하게.",
    "아잇 SitEight! 왜 이렇게 성급해? 내 초능력 맛 좀 볼래?",
    "어이 거기 자네. 너무 성급하게 웹에 들어가는거 아닌가? 우리, 신사답게 나긋하게 하자고.",
  ]

  let random = Math.floor(Math.random() * dontdothat.length)
  if (test === undefined) return res.send(`<h1>${dontdothat[random]}</h1>`)
  res.render("index.ejs", { posts: posts, client: client })
})

client.login(config.client.token)

module.exports = router
