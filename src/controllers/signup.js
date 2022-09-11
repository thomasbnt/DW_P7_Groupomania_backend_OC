const resp = require('../modules/responses')
const regexInputs = require('../modules/regexInputs')
const hash = require('../middlewares/hash')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.UsersSignup = async (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  console.log('Signup request received')
  if (JSON.parse(req.body.account)) {
    const account = JSON.parse(req.body.account)
    console.log({ account: account })
    console.log({ body: req.body.image })
    console.log({ email: account.email })
  } else {
    console.log('Err')
  }

  if (
    account &&
    account.email &&
    account.password &&
    account.lastName &&
    account.firstName &&
    req.body.image
  ) {
    const { email, password, firstName, lastName } = account
    const profileImage = req.body.image

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
        ? resp.badRequest("L'email que vous avez entré n'est pas valide", res)
        : null
      !passwordIsValid
        ? resp.badRequest(
            'Le mot de passe doit être au minimum de 8 caractères comprenant un caractère spécial, un chiffre, une lettre majuscule.',
            res
          )
        : null
      !firstName ? resp.badRequest("Votre prénom n'est pas valide", res) : null
      !lastName ? resp.badRequest("Votre nom n'est pas valide", res) : null
    }
  } else {
    resp.badRequest(
      'Il manque des informations pour vous enregistrer. Veuillez bien fournir tout les champs.',
      res
    )
  }
}
