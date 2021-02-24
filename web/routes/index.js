const router = require("express").Router()
const config = require("../../config")
const knex = require("knex")(config.database)
const Discord = require("discord.js")
const client = new Discord.Client()
const fs = require("fs")

router.get("/", (req, res) => {
  toofast(client, res)
  res.render("index", {
    user: req.session.user || null,
  })
})

router.get("/list", async (req, res) => {
  toofast(client, res)
  res.render("list", {
    posts: await knex("custom").select("*"),
    user: req.session.user || null,
    r_client: client,
  })
})

router.get("/study", async (req, res) => {
  toofast(client, res)
  if (req.session.user?.id === undefined)
    return res.send(`
  <script>
  alert("로그인이 필요합니다.")
  location.href = "./authorize"
  </script>
  `)
  res.render("study", {
    posts: await knex("custom")
      .select("*")
      .where({ author: req.session.user.id }),
    user: req.session.user || null,
    r_client: client,
  })
})

router.get("/url", async (req, res) => {
  let id = req.query
  if (id.v === undefined && id.f === undefined) return invaild(res)
  if (id.v === undefined) {
    let data = await knex("image").where({ keyword: id.f })
    if (data.length <= 0) return invaild(res)
    let path = require("path")
    const __dirname = path.resolve(path.dirname(""))
    let imagePath = path.resolve(__dirname, `../images/${data[0].image_name}`)
    fs.readFile(imagePath, function (_, image) {
      res.set("Content-Type", "image/png").send(image)
    })
  } else if (id.f === undefined) {
    let data = await knex("url").where({ keyword: id.v })
    if (data.length <= 0) return invaild(res)

    res.send(`
<script>
window.location.href = "${data[0].url}"
</script>
    `)
  }
})

function invaild(res) {
  res.send("<p>존재하지 않는 링크입니다.</p>")
}

function toofast(client, res) {
  let test = client.user?.username

  let dontdothat = [
    "잠시 후에 다시 시도해주세요.",
    "에헤이 이 사람아. 이렇게 성급해서 쓰나. 조금만 더 기다렸다가 다시 시도하게.",
    "아잇 SitEight! 왜 이렇게 성급해? 내 초능력 맛 좀 볼래?",
    "어이 거기 자네. 너무 성급하게 웹에 들어가는거 아닌가? 우리, 신사답게 나긋하게 하자고.",
  ]

  let random = Math.floor(Math.random() * dontdothat.length)
  if (test === undefined) return res.send(`<h1>${dontdothat[random]}</h1>`)
}

client.login(config.client.token)

module.exports = router
