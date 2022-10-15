const resp = require("../modules/responses")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { reaction: Reaction, post: Post, user: User } = prisma

exports.default = async (req, res) => {
  console.log("Reaction request received")
  try {
    // Total des réactions
    const reactions = await Reaction.findMany()
    res.status(200).json({ totalReactions: reactions.length })
  } catch (error) {
    resp.internalError("Internal error", res)
  }
}
// Ajouter une réaction
exports.ReactionAddRemove = async (req, res) => {
  console.log("ReactionAdd request received")
  // On vérifie si l'ID est présent et qui n'est pas null
  if (!req.params.id) return resp.badRequest("Vous avez oublié l'ID du post", res)
  // On vérifie si req.params.id est un nombre
  if (isNaN(req.params.id)) return resp.badRequest("L'ID du post doit être un nombre", res)
  // On récupère l'ID du post
  const postId = parseInt(req.params.id)
  // On récupère l'ID de l'utilisateur connecté par JWT et on le convertit en nombre
  const userId = parseInt(req.user.user.id)
  // On vérifie si l'userID n'est pas banni, sinon on ne peut pas réagir
  const user = await User.findUnique({
    where: { id: userId },
    select: { banned: true },
  })
  if (user.banned) return resp.forbidden("Vous êtes banni", res)
  // On vérifie si le post existe
  const post = await Post.findUnique({
    where: { id: postId },
    select: { id: true },
  })
  if (!post) return resp.notFound("Le post n'existe pas", res)

  // On vérifie si l'utilisateur a déjà réagi au post
  const alreadyReacted = await Reaction.findUnique({
    where: { postId: postId },
    select: { authorId: true },
  })
  // Si l'utilisateur n'a pas encore réagi au post
  if (!alreadyReacted) {
    // On ajoute la réaction
    await Reaction.create({
      data: {
        postId: postId,
        authorId: userId,
        reaction: "LIKE",
      },
    })
    return res.status(201).json({
      message: "Réaction ajoutée",
      code: 'REACTION_ADDED',
    })
  }
  // Si l'utilisateur a déjà réagi au post
  if (alreadyReacted) {
    // On supprime la réaction
    await Reaction.delete({
      where: { postId: postId },
      select: { postId: true, authorId: true },
    })
    return res.status(201).json({
      message: "Réaction supprimée",
      code: 'REACTION_REMOVED',
    })
  }
}
