const resp = require('../modules/responses')
const regexInputs = require('../modules/regexInputs')
const hash = require('../middlewares/hash')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { user: User } = prisma

// Signup and login part
exports.UsersSignup = async (req, res) => {
  console.log('Signup request received')
  // Vérifier si le contenu account n'est pas vide dans un premier temps
  try {
    const account = JSON.parse(req.body.account)
    if (
      !account &&
      !account.email &&
      !account.password &&
      !account.lastName &&
      !account.firstName
    )
      return resp.badRequest(
        'Il manque des informations pour vous enregistrer. Veuillez bien fournir tout les champs.',
        res
      )
    if (!req.file) return resp.badRequest('Veuillez ajouter une image', res)

    const { email, password, firstName, lastName } = account
    console.log({ email, password, firstName, lastName })

    // On vérifie si tous les champs sont bien remplis et si les regex sont respectés
    const emailIsValid = regexInputs.checkEmail(email)
    const passwordIsValid = regexInputs.checkPassword(password)
    const firstNameIsValid = regexInputs.checkText(firstName)
    const lastNameIsValid = regexInputs.checkText(lastName)
    console.log({
      emailIsValid,
      passwordIsValid,
      firstNameIsValid,
      lastNameIsValid,
    })

    if (!emailIsValid)
      return resp.badRequest(
        "L'email que vous avez entré n'est pas valide",
        res
      )
    if (!passwordIsValid)
      return resp.badRequest(
        'Le mot de passe doit être au minimum de 8 caractères comprenant un caractère spécial, un chiffre, une lettre majuscule.',
        res
      )
    if (!firstNameIsValid)
      return resp.badRequest(
        "Le prénom que vous avez entré n'est pas valide",
        res
      )
    if (!lastNameIsValid)
      return resp.badRequest("Le nom que vous avez entré n'est pas valide", res)

    const userFindUniqueByEmail = await prisma.user.findUnique({
      where: { email: email },
    })
    console.log({ userFindUniqueByEmail })
    if (userFindUniqueByEmail)
      return resp.badRequest(
        'Le compte avec cette adresse email existe déjà. Veuillez vous connecter.',
        res
      )
    if (!userFindUniqueByEmail) {
      await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: await hash.gen(password),
          imageProfile: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        },
      })
      resp.success('Compte créé avec succès', res)
    }
  } catch (error) {
    console.log({ error })
    resp.badRequest(
      'Veuillez bien remplir vos données de compte utilisateur.',
      res
    )
  }
}

exports.UsersLogin = async (req, res) => {
  console.log('Login request received')
  const { email, password } = req.body
  console.log({ email, password })
  if (!email || !password)
    return resp.badRequest('Veuillez remplir tous les champs', res)
  const userFindUniqueByEmail = await prisma.user.findUnique({
    where: { email: email },
  })
  if (!userFindUniqueByEmail)
    return resp.badRequest(
      "Le compte avec cette adresse email n'existe pas. Veuillez vous enregistrer.",
      res
    )
  // On vérifie si le mot de passe est correct
  const passwordIsValid = await hash.compare(
    password,
    userFindUniqueByEmail.password
  )
  if (!passwordIsValid)
    return resp.badRequest('Lse mot de passe est incorrect', res)
  // On génère un token
  // TODO : Input MemorizeMe pour le front
  const token = await hash.genToken(userFindUniqueByEmail)
  console.log({ token })
  res.status(200).json({
    message: 'Connexion réussie',
    token: token,
  })
}

// Me part
exports.UsersMeGet = async (req, res) => {
  console.log('Get user request received')
  console.log({ user: req.user })
  const allDataOfUser = req.user
  // On met user dans un objet pour pouvoir le modifier
  const userObject = { ...allDataOfUser }

  // ajout d'un message
  userObject.message = 'Informations utilisateur récupérées avec succès'

  // On supprime certaines informations de l'utilisateur
  delete userObject.user.password
  delete userObject.user.email
  delete userObject.user.banned
  delete userObject.user.role
  delete userObject.iat

  // On renvoie l'objet
  resp.success(userObject, res)
}
exports.UsersMePut = async (req, res) => {
  console.log('Update user request received')
  resp.success('Good', res)
}
exports.UsersMeDelete = async (req, res) => {
  console.log('Delete user request received')
  resp.success('Good', res)
}
exports.UsersSecurity = async (req, res) => {
  console.log('Security user request received')
  resp.success('Good', res)
}
