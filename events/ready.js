module.exports = async (client) => {
  console.log("=".repeat(40))
  console.log(
    `${client.user.username}#${client.user.discriminator} IS READY!\n\n전체 유저 수: ${client.users.cache.size}`
  )
  console.log("=".repeat(40))
}
