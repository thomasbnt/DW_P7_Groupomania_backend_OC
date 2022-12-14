const resp = require("../modules/responses")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const regexInputs = require("../modules/regexInputs")
const { post: Post } = prisma

// Créer un nouveau post
exports.PostsCreateOne = async (req, res) => {
  console.log("PostsCreateOne request received")
  // On vérifie si le contenu du post n'est pas vide
  if (req.body.content) {
    const { text, altText } = JSON.parse(req.body.content)
    // On vérifie si le contenu du post est valide
    const textIsValid = regexInputs.checkText(text)
    if (!textIsValid) return resp.badRequest("Le contenu du post n'est pas valide", res)
    // On vérifie s'il y a une image, alors si elle est là, l'altText doit être valide
    const altTextIsValid = regexInputs.checkText(altText)
    const imageIsHere = req.file
    let newPost
    // Le post et l'alt text pas plus de 500 caractères
    if (text.length > 500) return resp.badRequest("Le contenu du post ne doit pas dépasser 500 caractères", res)
    if (imageIsHere) {
      if (!altTextIsValid) {
        return resp.badRequest( "Le texte alternatif de l'image n'est pas valide", res)
      }
      if (altText.length > 500) return resp.badRequest("Le contenu de l'alt text ne doit pas dépasser 500 caractères", res)
      // On crée le post avec l'image
      newPost = await Post.create({
        data: {
          userId: req.user.user.id,
          text: text,
          altText: altText,
          image: `${req.protocol}://${req.get("host")}/images/posts/${req.file.filename}`,
          createdAt: new Date(),
        },
      })
      console.log("Post with image created");
      res.status(201).json({ message: "Le post a bien été créé", post: newPost })
    } else {
      // On crée le post sans image
      newPost = await Post.create({
        data: {
          userId: req.user.user.id,
          text: text,
          altText: null,
          createdAt: new Date(),
        },
      })
      console.log("Post without image created");
      res.status(201).json({ message: "Le post a bien été créé", post: newPost })
    }
  } else {
    res.status(400).json({ message: "Le contenu du post n'est pas valide" })
  }
}

// Récupérer tous les posts
exports.PostsGetAll = async (req, res) => {
  console.log("PostsGetAll request received")
  // On récupère tous les posts
  try {
    // On récupère tous les posts
    const posts = await Post.findMany({
      // On affiche les informations d'userId sauf les mots de passe
      include: {
        reactions: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageProfile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    resp.success(posts, res)
  } catch (error) {
    console.log(error)
    resp.internalError("Une erreur est survenue", res)
  }
}

// Récupérer un seul post
exports.PostsGetOne = async (req, res) => {
  console.log("PostsGetOne request received")
  // On mets req.params.id dans une variable format Int
  const id = parseInt(req.params.id)
  // On vérifie si l'id est valide
  if (!id) return resp.badRequest("L'id du post n'est pas valide", res)

  try {
    // On récupère le post
    const post = await Post.findUnique({
      where: { id: id },
      // On affiche les informations d'userId sauf les mots de passe
      include: {
        reactions: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageProfile: true,
          },
        },
      },
    })
    resp.success(post, res)
  } catch (error) {
    console.log(error)
    resp.notFound("Le post n'existe pas", res)
  }
}

// Mettre à jour un seul post
exports.PostsUpdateOne = async (req, res) => {
  console.log("PostsUpdateOne request received")
  // On vérifie si le contenu du post n'est pas vide
  if (req.body.content) {
    // On récupère l'id du post
    const id = parseInt(req.params.id)

    // On vérifie si l'id est valide
    if (!id) return resp.badRequest("L'id du post n'est pas valide", res)

    // On vérifie si l'auteur du post est l'utilisateur connecté
    const post = await prisma.post.findUnique({
      where: { id: id },
      select: {
        userId: true,
      },
    })
    if (post.userId !== req.user.user.id) return resp.forbidden("Vous n'êtes pas l'auteur du post", res)

    // On vérifie s'il y a une image
    if (req.file) {
      const { text, altText } = JSON.parse(req.body.content)
      // On vérifie si le contenu du post est valide, alors si elle est là, le texte doit être valide
      const textIsValid = regexInputs.checkText(text)
      if (!textIsValid) return resp.badRequest("Le contenu du post n'est pas valide", res)
      // On vérifie s'il y a une image, alors si elle est là, l'altText doit être valide
      const altTextIsValid = regexInputs.checkText(altText)
      if (!altTextIsValid) return resp.badRequest("Le texte alternatif de l'image n'est pas valide", res)
      // On met à jour le post avec l'image
      try {
        const postUpdated = await Post.update({
          where: { id: parseInt(req.params.id) },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageProfile: true,
                reactions: true,
              },
            },
          },
          data: {
            text: text,
            altText: altText,
            image: `${req.protocol}://${req.get("host")}/images/posts/${req.file.filename}`,
          },
        })
        res.status(200).json({ message: "Le post a bien été mis à jour", post: postUpdated })
      } catch (error) {
        resp.internalError("Une erreur est survenue", res)
      }
    } else {
      const { text } = JSON.parse(req.body.content)
      // On vérifie si le contenu du post est valide
      const textIsValid = regexInputs.checkText(text)
      if (!textIsValid) return resp.badRequest("Le contenu du post n'est pas valide", res)
      // On met à jour le post sans image
      try {
        const updatedPostWithoutImage = await prisma.post.update({
          where: { id: parseInt(req.params.id) },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageProfile: true,
                reactions: true,
              },
            },
          },
          data: {
            text: text,
            altText: null,
            image: null,
          },
        })
        res.status(200).json({
          message: "Le post a bien été mis à jour",
          post: updatedPostWithoutImage,
        })
      } catch (error) {
        resp.internalError("Une erreur est survenue", res)
      }
    }
  } else {
    return resp.badRequest("Le contenu du post est vide", res)
  }
}

// Supprimer un seul post
exports.PostsDeleteOne = async (req, res) => {
  console.log("PostsDeleteOne request received")
  // On récupère l'id du post
  const id = parseInt(req.params.id)
  // On vérifie si l'id est valide
  if (!id) return resp.badRequest("L'ID du post n'est pas valide", res)
  // On vérifie si l'auteur du post est l'utilisateur connecté
  const post = await prisma.post.findUnique({
    where: { id: id },
    select: {
      userId: true,
    },
  })
  if ((post.userId !== req.user.user.id) && req.user.user.role !== 'ADMIN') return resp.forbidden("Vous n'êtes pas l'auteur du post", res)
  // On supprime le post
  try {
    await Post.delete({ where: { id: id } })
    res.status(200).json({ message: "Le post a bien été supprimé" })
  } catch (error) {
    console.log(error);
    resp.internalError("Une erreur est survenue", res)
  }
}
