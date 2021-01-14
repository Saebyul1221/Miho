const express = require("express")
const router = express.Router()
const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("../config")
const knex = require("knex")(config.database)

router.get("/", async function (_req, res) {
  let posts = await knex("custom").select("*")
  let test = client.user?.username

  if (test === undefined) return res.send("<p>잠시 후에 다시 시도해주세요.</p>")
  res.render("index.ejs", { posts: posts, client: client })
})

client.login(config.client.token)

module.exports = router
