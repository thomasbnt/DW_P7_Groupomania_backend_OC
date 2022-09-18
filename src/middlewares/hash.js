const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const salt = bcrypt.genSaltSync(10)
class Hash {
  // hash password
  async gen(password) {
    return await bcrypt.hash(password, salt)
  }
  // compare password
  async compare(password, hash) {
    return await bcrypt.compare(password, hash)
  }
  // generate token
  async genToken(user) {
    return await jwt.sign({ user }, process.env.JWT_SECRET_KEY)
  }
}

module.exports = new Hash()
