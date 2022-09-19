const resp = require("../modules/responses")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// Créer un nouveau post
exports.PostsCreateOne = async (req, res) => {
  console.log("PostsCreateOne request received")
  resp.success("[CREATE UN POST]", res)
}

// Récupérer tous les posts
exports.PostsGetAll = async (req, res) => {
  console.log("PostsGetAll request received")
  resp.success("[TOUT LES POSTS]", res)
}

// Récupérer un seul post
exports.PostsGetOne = async (req, res) => {
  console.log("PostsGetOne request received")
  resp.success("[UN POST]", res)
}

// Mettre à jour un seul post
exports.PostsUpdateOne = async (req, res) => {
  console.log("PostsUpdateOne request received")
  resp.success("[UPDATE UN POST]", res)
}

// Supprimer un seul post
exports.PostsDeleteOne = async (req, res) => {
  console.log("PostsDeleteOne request received")
  resp.success("[DELETE UN POST]", res)
}
