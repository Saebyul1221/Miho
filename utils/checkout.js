const config = require("../config/client")

module.exports = class CheckOut {
  constructor(client, guild, knex) {
    this.client = client
    this.guild = guild
    this.knex = knex
    this.ignoreRole = "727735851232133121"
    this.detectRole = "819032348842393641"
  }

  async addRole() {
    let catchedUser = await this.knex("statusMsg")
    let users = new Array()
    for (let value of catchedUser) {
      users.push(value.author)
    }
    this.guild.members.cache.forEach(async (member) => {
      let userinfo = this.client.users.cache.get(member.id).presence
        .activities[0]?.state
      let hasRole = member.roles.cache.find((r) => r.id === this.ignoreRole)
      if (
        hasRole === undefined &&
        userinfo !== undefined &&
        userinfo !== null &&
        userinfo.includes("discord.gg") &&
        users.some((user) => member.id.includes(user)) === false
      ) {
        console.log("ADD ROLE: ", member.id)
        await this.knex("statusMsg").insert({
          author: member.id,
          defaultName: member.displayName,
        })
        member.setNickname("잡상인")
        member.roles.add(this.detectRole).catch(() => {
          this.client.users.cache.get(config.owners[0]).send(`
\`${member.displayName}( ${member.id} )\` 유저를 제한하던 중 오류가 발생하였습니다.
          `)
        })
      }
    })
  }

  async removeRole() {
    let catchedUser = await this.knex("statusMsg")
    let users = new Array()
    for (let value of catchedUser) {
      users.push(value.author)
    }
    this.guild.members.cache.forEach(async (member) => {
      let userinfo = this.client.users.cache.get(member.id).presence
        .activities[0]?.state
      let currentStatus = this.client.users.cache.get(member.id).presence.status
      if (currentStatus === "offline") return
      if (
        (userinfo === null ||
          userinfo === undefined ||
          !userinfo.includes("discord.gg")) &&
        users.some((user) => member.id.includes(user)) === true
      ) {
        console.log("REMOVE ROLE: ", member.id)
        let org = (await this.knex("statusMsg").where({ author: member.id }))[0]
        member.setNickname(org.defaultName)
        member.roles.remove(this.detectRole)
        await this.knex("statusMsg").where({ author: member.id }).del()
      }
    })
  }
}
