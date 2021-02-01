const { Intents } = require("discord.js")

module.exports = {
  token: "토큰",
  prefix: "미호야 ",
  owners: ["405714654065721344"],
  bot: {
    presence: {
      activity: {
        name: "Test Launching",
      },
    },
    ws: { intents: new Intents(Intents.ALL) },
  },
  pingpong_token: "Basic token",
  pingpong_url: "",
  tenor_token: "",
  ignore_nsfw_tag: [],
  hypixel_token: "",
}
