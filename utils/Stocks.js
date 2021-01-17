module.exports = class Stocks {
  constructor(knex) {
    this.knex = knex
  }

  async update() {
    let stocks = await this.knex("stocks").select("*")

    for (let i = 0; i < stocks.length; i++) {
      let random = Math.floor(Math.random() * 20) + -10
      let now = Number(stocks[i].now) + random
      if (now > 50) {
        await this.knex("stocks")
          .update({
            now,
            prices: `[${now}]`,
            lastchange: Number(stocks[i].now),
          })
          .where({
            name: stocks[i].name,
          })
      } else {
        let current = Number(stocks[i].now) + Math.floor(Math.random() * 8)
        await this.knex("stocks")
          .update({
            now: current,
            prices: `[${current}]`,
            lastchange: Number(stocks[i].now),
          })
          .where({
            name: stocks[i].name,
          })
      }
    }
  }
}
