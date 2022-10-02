function checkNameOfImageMulter(image) {
  return (req, res, next) => {
    console.log({ req })
    // On récupère le nom de l'image
    const name = req.file
    console.log({ name })
    // On vérifie si sur la route POST /signup, il y a une image nommé profileImage
    if (image.originalname.split(".")[0] === "profileImage") {
      // Si oui, on renvoie true
      next()
    }
    // On vérifie si sur la route PUT /me, il y a une image nommé profileImage
    if (image.originalname.split(".")[0] === "profileImage") {
      // Si oui, on renvoie true
      next()
    }
    // On vérifie si sur la route POST /post, il y a une image nommé imagePost
    if (image.originalname.split(".")[0] === "image") {
      // Si oui, on renvoie true
      next()
    }
    // On vérifie si sur la route PUT /post, il y a une image nommé imagePost
    if (image.originalname.split(".")[0] === "image") {
      // Si oui, on renvoie true
      next()
    }
    return res.status(400).json({ error: "Le nom de l'image n'est pas valide" })
  }
}

module.exports = checkNameOfImageMulter
