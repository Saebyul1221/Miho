module.exports = class Hosting {
  constructor(message, args, knex) {
    this.message = message
    this.args = args
    this.knex = knex
  }

  async enrollmentLink(registerURL) {
    let data = await this.knex("url").where({ url: registerURL })
    if (data.length > 0) return this.already("v", data[0].keyword)

    let randomString = require("../utils/randomString")()
    await this.knex("url").insert({
      keyword: randomString,
      url: registerURL,
      author: this.message.author.id,
    })

    return this.success("v", randomString)
  }

  async enrollmentFile(image) {
    let data = await this.knex("image").where({ image_name: image.name })
    if (data.length > 0) return this.already("f", data[0].keyword)

    this.downloadFile(image)
    let randomString = require("../utils/randomString")()
    await this.knex("image").insert({
      keyword: randomString,
      image_name: image.name,
      author: this.message.author.id,
    })

    return this.success("f", randomString)
  }

  downloadFile(file) {
    let request = require("request")
    let fs = require("fs")
    let path = require("path")
    let imagePath = path.resolve(__dirname, `../web/images/${file.name}`)
    let extension = file.name.split(".")
    let ctx = extension.split(".")
    let accepetExp = ["png", "jpeg", "jpg"]
    if (!accepetExp.some((exp) => exp.includes(ctx[ctx.length])))
      return this.exitst()
    request.get(file.url).pipe(fs.createWriteStream(imagePath))
  }

  already(type, url) {
    let _type = type === "v" ? "링크" : "이미지"
    this.message.channel.send(
      `${this.message.member} 이미 해당 ${_type}는 등록되있어요!
      링크: ||https://whitekj.xyz/url?${type}=${url}||`
    )
  }

  success(type, url) {
    let _type = type === "v" ? "링크" : "이미지"
    this.message.channel.send(
      `${this.message.member} 성공적으로 ${_type}가 등록이 됬습니다!
      링크: ||https://whitekj.xyz/url?${type}=${url}||`
    )
  }

  exitst() {
    this.message.channel.send(
      `${message.member} 등록이 가능한 확장자가 아닙니다!
      지원하는 확장자: \₩[png, jpeg, jpg]\₩`
    )
  }
}
