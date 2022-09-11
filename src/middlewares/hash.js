const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
class Hash {
  // hash password
  async gen(password) {
    return await bcrypt.hash(password, salt)
  }
}

module.exports = new Hash()
