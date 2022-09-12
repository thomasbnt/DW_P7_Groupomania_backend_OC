const resp = require('../modules/responses')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// GET ALL POSTS
exports.PostsGetAll = async (req, res) => {
  console.log('PostsGetAll request received')
  resp.success('[TOUT LES POSTS]', res)
}
