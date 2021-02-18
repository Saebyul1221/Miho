module.exports = () => {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
  let string_length = 5
  let randomstring = ""
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length)
    randomstring += chars.substring(rnum, rnum + 1)
  }
  return randomstring
}
