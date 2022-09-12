const resp = require('../modules/responses')
const regexInputs = require('../modules/regexInputs')
const hash = require('../middlewares/hash')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.UsersSignup = async (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  console.log('Signup request received')
  // Vérifier si le contenu account n'est pas vide dans un premier temps
  if (req.body.account) {
    console.log(req.file.filename)
    try {
      const account = JSON.parse(req.body.account)
      console.log({ firstName: account.firstName })

      if (
        account &&
        account.email &&
        account.password &&
        account.lastName &&
        account.firstName &&
        req.file
      ) {
        const { email, password, firstName, lastName } = account
        const profileImage = req.file.filename
        console.log({ profileImage })

        regexInputs.checkEmail(email)
        regexInputs.checkPassword(password)
        regexInputs.checkText(firstName)
        regexInputs.checkText(lastName)

        const emailIsValid = regexInputs.checkEmail(email)
        const passwordIsValid = regexInputs.checkPassword(password)
        const firstNameIsValid = regexInputs.checkText(firstName)
        const lastNameIsValid = regexInputs.checkText(lastName)

        if (
          emailIsValid &&
          passwordIsValid &&
          firstNameIsValid &&
          lastNameIsValid
        ) {
          const userAlreadyExists = await prisma.user.findUnique({
            where: { email: email },
          })
          console.log({ userAlreadyExists })
          if (userAlreadyExists) {
            await prisma.user.create({
              data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: await hash.gen(password),
                profileImage: profileImage,
              },
            })
          }
        } else {
          !emailIsValid
            ? resp.badRequest(
                "L'email que vous avez entré n'est pas valide",
                res
              )
            : null
          !passwordIsValid
            ? resp.badRequest(
                'Le mot de passe doit être au minimum de 8 caractères comprenant un caractère spécial, un chiffre, une lettre majuscule.',
                res
              )
            : null
          !firstName
            ? resp.badRequest("Votre prénom n'est pas valide", res)
            : null
          !lastName ? resp.badRequest("Votre nom n'est pas valide", res) : null
        }
      } else {
        resp.badRequest(
          'Il manque des informations pour vous enregistrer. Veuillez bien fournir tout les champs.',
          res
        )
      }
    } catch (error) {
      console.log(error)
      resp.badRequest('Le contenu de la requête est incorrect', res)
    }
  } else {
    resp.badRequest(
      'Il manque des informations pour vous enregistrer. Veuillez bien fournir tout les champs.',
      res
    )
  }
}
exports.UsersLogin = async (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST')
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
exports.UsersGetAll = async (req, res) => {
  console.log('Get all users request received')
  resp.success('Good', res)
}

// Me Controller
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
