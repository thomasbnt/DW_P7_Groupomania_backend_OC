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
  const account = JSON.parse(req.body.account)
  if (JSON.parse(req.body.account)) {
    const account = JSON.parse(req.body.account)
    console.log({ account: account })
    console.log({ email: account.email })
  } else {
    console.log('Err')
  }

  if (account && account.email && account.password) {
    const { email, password } = account

    regexInputs.checkEmail(email)
    regexInputs.checkPassword(password)

    const emailIsValid = regexInputs.checkEmail(email)
    const passwordIsValid = regexInputs.checkPassword(password)

    if (emailIsValid && passwordIsValid) {
      const user = await prisma.user.findUnique({
        where: { email: email },
      })
      console.log({ user })
      if (user) {
        const passwordIsValid = await hash.compare(password, user.password)
        if (passwordIsValid) {
          resp.success(user, res)
        } else {
          resp.badRequest('Mot de passe incorrect', res)
        }
      } else {
        resp.badRequest("L'utilisateur n'existe pas", res)
      }
    } else {
      !emailIsValid
        ? resp.badRequest("L'email que vous avez entré n'est pas valide", res)
        : null
      !passwordIsValid
        ? resp.badRequest(
            'Le mot de passe doit être au minimum de 8 caractères comprenant un caractère spécial, un chiffre, une lettre majuscule.',
            res
          )
        : null
    }
  } else {
    resp.badRequest(
      'Il manque des informations pour vous connecter. Veuillez bien fournir tout les champs.',
      res
    )
  }
}

// Me part
exports.UsersMeGet = async (req, res) => {
  console.log('Get user request received')
  resp.success('Good', res)
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
