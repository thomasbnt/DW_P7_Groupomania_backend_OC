const resp = require("../modules/responses");
const regexInputs = require("../modules/regexInputs");
const hash = require("../middlewares/hash");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { post: Post, user: User, reaction: Reaction } = prisma;

function ajoutVirgule(informationsEdited) {
  informationsEdited.splice(informationsEdited.length - 1, 0, "et");
  // remplace les virgules par des espaces ainsi que les majuscules par des minuscules
  informationsEdited = informationsEdited.join(" ").toLowerCase();
  return informationsEdited;
}

// Signup
exports.UsersSignup = async (req, res) => {
  console.log("Signup request received");
  // Vérifier si le contenu account n'est pas vide dans un premier temps
  try {
    const account = JSON.parse(req.body.account);
    if (!account && !account.email && !account.password && !account.lastName && !account.firstName)
      return resp.badRequest(
        "Il manque des informations pour vous enregistrer. Veuillez bien fournir tout les champs.",
        res
      );
    if (!req.file) return resp.badRequest("Veuillez ajouter une image", res);

    const { email, password, firstName, lastName } = account;
    console.log({ email, password, firstName, lastName });

    // On vérifie si tous les champs sont bien remplis et si les regex sont respectés
    const emailIsValid = regexInputs.checkEmail(email);
    const passwordIsValid = regexInputs.checkPassword(password);
    const firstNameIsValid = regexInputs.checkText(firstName);
    const lastNameIsValid = regexInputs.checkText(lastName);
    console.log({
      emailIsValid,
      passwordIsValid,
      firstNameIsValid,
      lastNameIsValid
    });

    if (!emailIsValid) return resp.badRequest("L'email que vous avez entré n'est pas valide", res);
    if (!passwordIsValid)
      return resp.badRequest(
        "Le mot de passe doit être au minimum de 8 caractères comprenant un caractère spécial, un chiffre, une lettre majuscule.",
        res
      );
    if (!firstNameIsValid) return resp.badRequest("Le prénom que vous avez entré n'est pas valide", res);
    if (!lastNameIsValid) return resp.badRequest("Le nom que vous avez entré n'est pas valide", res);

    const userFindUniqueByEmail = await prisma.user.findUnique({
      where: { email: email }
    });
    console.log({ userFindUniqueByEmail });
    if (userFindUniqueByEmail)
      return resp.badRequest("Le compte avec cette adresse email existe déjà. Veuillez vous connecter.", res);
    if (!userFindUniqueByEmail) {
      await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: await hash.gen(password),
          imageProfile: `${req.protocol}://${req.get("host")}/images/profiles/${req.file.filename}`
        }
      });
      // On génère un token
      const token = await hash.genToken(userFindUniqueByEmail);
      res.status(201).json({ message: "Compte créé avec succès", session_token: token });
    }
  } catch (error) {
    console.log({ error });
    resp.badRequest("Veuillez bien remplir vos données de compte utilisateur.", res);
  }
};

// Login
exports.UsersLogin = async (req, res) => {
  console.log("Login request received");
  const { email, password } = req.body;
  if (!email || !password) return resp.badRequest("Veuillez remplir tous les champs", res);
  const userFindUniqueByEmail = await prisma.user.findUnique({
    where: { email: email }
  });
  if (!userFindUniqueByEmail)
    return resp.badRequest("Le compte avec cette adresse email n'existe pas. Veuillez vous enregistrer.", res);
  // On vérifie si le mot de passe est correct
  const passwordIsValid = await hash.compare(password, userFindUniqueByEmail.password);
  if (!passwordIsValid) return resp.badRequest("Le mot de passe est incorrect", res);
  // Vérifier si l'user est banni
  if (userFindUniqueByEmail.banned) return resp.badRequest("Vous ne pouvez pas vous connecter à votre compte.", res);
  // TODO #2 : Input MemorizeMe pour le front
  // On génère un token
  const token = await hash.genToken(userFindUniqueByEmail);
  res.status(200).json({
    message: "Connexion réussie",
    session_token: token,
    isBanned: userFindUniqueByEmail.banned
  });
};

// Me part
exports.UsersMeGet = async (req, res) => {
  console.log("Get user request received");
  const allDataOfUser = req.user;
  // On met user dans un objet pour pouvoir le modifier
  const userObject = { ...allDataOfUser };

  // ajout d'un message
  userObject.message = "Informations utilisateur récupérées avec succès";

  // On supprime certaines informations de l'utilisateur
  delete userObject.user.password;
  delete userObject.user.banned;
  delete userObject.user.role;
  delete userObject.iat;

  // On renvoie l'objet
  resp.success(userObject, res);
};

exports.UsersMePut = async (req, res) => {
  console.log("Update user request received");
  let informationsEdited = [];
  // On vérifie si le contenu account.firstName n'est pas vide
  if (req.body.account) {
    const account = JSON.parse(req.body.account);
    const { firstName, lastName } = account;
    if (account.firstName) {
      // On vérifie si le prénom est valide
      const firstNameIsValid = regexInputs.checkText(firstName);
      if (firstNameIsValid) {
        // On met à jour le prénom
        await prisma.user.update({
          where: { id: req.user.user.id },
          data: { firstName: firstName.trim() }
        });
        informationsEdited.push("Le prénom");
      }
    }

    if (account.lastName) {
      // On vérifie si le nom est valide
      const lastNameIsValid = regexInputs.checkText(lastName);
      if (lastNameIsValid) {
        // On met à jour le nom
        await prisma.user.update({
          where: { id: req.user.user.id },
          data: { lastName: lastName.trim() }
        });
        informationsEdited.push("Le nom");
      }
    }
  }

  if (req.file) {
    // On met à jour l'image de profil
    try {
      await prisma.user.update({
        where: { id: req.user.user.id },
        data: {
          imageProfile: `${req.protocol}://${req.get("host")}/images/profiles/${req.file.filename}`
        }
      });
      informationsEdited.push("L'image de profil");
    } catch (error) {
      console.log({ error });
    }
  }

  function actualizeJWTToken() {
    return new Promise(async (resolve, reject) => {
      const userFindUniqueById = await prisma.user.findUnique({
        where: { id: req.user.user.id }
      });
      const token = await hash.genToken(userFindUniqueById);
      console.log({ userFindUniqueById });
      resolve(token);
    });
  }


  // On renvoie les informations modifiées
  if (informationsEdited.length === 0) {
    return resp.badRequest("Aucune information n'a été modifiée", res);
  }
  if (informationsEdited.length <= 1) {
    return res.status(200).json({
      message: `${informationsEdited} a été modifié avec succès`,
      session_token: await actualizeJWTToken()
    });
  }
  if (informationsEdited.length > 1 && informationsEdited.length < 3) {
    return res.status(200).json({
      message: `Les informations suivantes ont été modifiées : ${ajoutVirgule(informationsEdited)}.`,
      session_token: await actualizeJWTToken()
    });
  }
  if (informationsEdited.length >= 3) {
    return res.status(200).json({
      message: `Les informations suivantes ont été modifiées : le prénom, le nom et l'image de profil.`,
      session_token: await actualizeJWTToken()
    });
  }
};

exports.UsersMeDelete = async (req, res) => {
  console.log("Delete user request received");
  // On supprime l'utilisateur
  try {
    await User.delete({
      where: { id: parseInt(req.user.user.id) }
    });
    // On supprime tous les posts créés par ce compte
    await Post.deleteMany({
      where: { author: req.user.user.id }
    });
    // On supprime toutes les réactions créées par ce compte
    await Reaction.deleteMany({
      where: { author: req.user.user.id }
    });
    resp.success("Votre compte a été supprimé avec succès", res);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "L'utilisateur n'existe pas/plus.",
      codeError: "USER_NOT_FOUND"
    });
  }
};

exports.UsersSecurity = async (req, res) => {
  console.log("Security user request received");
  let changedActions = [];
  // On vérifie si le mot de passe a été changé
  if (req.body.newPassword) {
    // On vérifie si le mot de passe est valide
    const passwordIsValid = regexInputs.checkPassword(req.body.newPassword);
    if (passwordIsValid) {
      // On hash le mot de passe
      const passwordHashed = await hash.gen(req.body.newPassword);
      // On met à jour le mot de passe
      try {
        await prisma.user.update({
          where: { id: req.user.user.id },
          data: { password: passwordHashed }
        });
        changedActions.push("Le mot de passe");
      } catch (error) {
        console.log({ error });
        resp.badRequest("L'utilisateur n'existe pas/plus.", res);
      }
    } else {
      return res.status(400).json({
        error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.",
        codeError: "PASSWORD_INVALID"
      });
    }
  }

  // On vérifie si l'email a été changé
  if (req.body.newEmail) {
    // On vérifie si l'email est valide
    const emailIsValid = regexInputs.checkEmail(req.body.newEmail);
    if (emailIsValid) {
      // On met à jour l'email
      try {
        await prisma.user.update({
          where: { id: req.user.user.id },
          data: { email: req.body.newEmail }
        });
        changedActions.push("L'email");
      } catch (error) {
        res.status(400).json({
          error: "L'utilisateur n'existe pas/plus.",
          codeError: "USER_NOT_FOUND"
        });
      }
    } else {
      return resp.badRequest("L'email n'est pas valide.", res);
    }
  }

  function actualizeJWTToken() {
    return new Promise(async (resolve, reject) => {
      const userFindUniqueById = await prisma.user.findUnique({
        where: { id: req.user.user.id }
      });
      const token = await hash.genToken(userFindUniqueById);
      console.log({ userFindUniqueById });
      resolve(token);
    });
  }

  if (changedActions.length === 0) {
    return res.status(400).json({
      message: `Aucune information n'a été modifiée`,
      codeError: "NO_INFORMATION_CHANGED"
    });
  }
  if (changedActions.length <= 1) {
    return res.status(200).json({
      message: `${changedActions} a été modifié.`,
      session_token: await actualizeJWTToken()
    });
  }
  if (changedActions.length > 1 && changedActions.length < 3) {
    return res.status(200).json({
      message: `Les informations suivantes ont été modifiées : ${ajoutVirgule(changedActions)}.`,
      session_token: await actualizeJWTToken()
    });
  }
};
