const resp = require('../modules/responses')
exports.status = async (req, res) => {
  console.log('status route has been called')
  resp.success('Tout est up!', res)
}
