const resp = require("../modules/responses");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const regexInputs = require("../modules/regexInputs");
const { post: Post } = prisma;

// Créer un nouveau post
exports.PostsCreateOne = async (req, res) => {
  console.log("PostsCreateOne request received");
  // On vérifie si le contenu du post n'est pas vide
  if (req.body.content) {
    const { text, altText } = JSON.parse(req.body.content);
    // On vérifie si le contenu du post est valide
    const textIsValid = regexInputs.checkText(text);
    if (!textIsValid) return resp.badRequest("Le contenu du post n'est pas valide", res);
    // On vérifie s'il y a une image, alors si elle est là, l'altText doit être valide
    const altTextIsValid = regexInputs.checkText(altText);
    const imageIsHere = req.file;
    if (imageIsHere) {
      if (!altTextIsValid) {
        return resp.badRequest(
          400,
          "Le texte alternatif de l'image n'est pas valide",
          res
        );
      }
      // On crée le post avec l'image
      await prisma.post.create({
        data: {
          userId: req.user.user.id,
          text: text,
          altText: altText,
          image: `${req.protocol}://${req.get("host")}/images/posts/${
            req.file.filename
          }`,
          createdAt: new Date()
        }
      });
    } else {
      // On crée le post sans image
      await prisma.post.create({
        data: {
          userId: req.user.user.id,
          text: text,
          altText: null,
          createdAt: new Date()
        }
      });
    }
    resp.success("Le post a bien été créé", res);
  } else {
    resp.badRequest("Le contenu du post est vide", res);
  }
};

// Récupérer tous les posts
exports.PostsGetAll = async (req, res) => {
  console.log("PostsGetAll request received");
  // On récupère tous les posts
  try {
    // On récupère tous les posts
    const posts = await Post.findMany({
      // On affiche les informations d'userId sauf les mots de passe
      /*include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageProfile: true
          }
        }
      }*/

    });
    resp.success(posts, res);
  } catch (error) {
    console.log(error);
    resp.internalError("Une erreur est survenue", res);
  }
};

// Récupérer un seul post
exports.PostsGetOne = async (req, res) => {
  console.log("PostsGetOne request received");
  // On mets req.params.id dans une variable format Int
  const id = parseInt(req.params.id);
  // On vérifie si l'id est valide
  if (!id) return resp.badRequest("L'id du post n'est pas valide", res);

  try {
    // On récupère le post
    const post = await Post.findUnique({
      where: { id: id },
      // On affiche les informations d'userId sauf les mots de passe
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageProfile: true
          }
        }
      }
    });
    resp.success(post, res);
  } catch (error) {
    console.log(error);
    resp.notFound("Le post n'existe pas", res);
  }
};

// Mettre à jour un seul post
exports.PostsUpdateOne = async (req, res) => {
  console.log("PostsUpdateOne request received");
  // On vérifie si le contenu du post n'est pas vide
  if (req.body.content) {
    const { text, altText } = JSON.parse(req.body.content);
  }
  // On récupère l'id du post
  const id = parseInt(req.params.id);
  // On vérifie si l'id est valide
  if (!id) {
    return resp.badRequest("L'id du post n'est pas valide", res);
  }
  // On vérifie si l'auteur du post est l'utilisateur connecté
  const post = await prisma.post.findUnique({
    where: { id: id },
    select: {
      userId: true
    }
  });
  if (post.userId !== req.user.user.id)
    return resp.forbidden("Vous n'êtes pas l'auteur du post", res);


  // On vérifie s'il y a une image
  if (req.file) {
    // On vérifie si le contenu du post est valide, alors si elle est là, le texte doit être valide
    const textIsValid = regexInputs.checkText(text);
    if (!textIsValid)
      return resp.badRequest("Le contenu du post n'est pas valide", res);
    // On vérifie s'il y a une image, alors si elle est là, l'altText doit être valide
    const altTextIsValid = regexInputs.checkText(altText);
    if (!altTextIsValid)
      return resp.badRequest(
        "Le texte alternatif de l'image n'est pas valide",
        res
      );
  }
};

// Supprimer un seul post
exports.PostsDeleteOne = async (req, res) => {
  console.log("PostsDeleteOne request received");
  resp.success("[DELETE UN POST]", res);
};
