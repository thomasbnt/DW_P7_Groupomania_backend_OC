const Users = require("../models/Users");
const resp = require('../modules/responses');
const regexInputs = require("../modules/regexInputs");
const hash = require("../middlewares/hash");

exports.UsersSignup = (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    console.log('Signup request received');
    const {email, password, firstName, lastName} = req.body

    regexInputs.checkEmail(email)
    regexInputs.checkPassword(password)
    regexInputs.checkText(firstName)
    regexInputs.checkText(lastName)

    const emailIsValid = regexInputs.checkEmail(email);
    const passwordIsValid = regexInputs.checkPassword(password);
    const firstNameIsValid = regexInputs.checkText(firstName);
    const lastNameIsValid = regexInputs.checkText(lastName);

    if (emailIsValid && passwordIsValid && firstNameIsValid && lastNameIsValid) {

    } else {
        !emailIsValid ? resp.badRequest('L\'email que vous avez entré n\'est pas valide', res) : null;
        !passwordIsValid ? resp.badRequest('Le mot de passe doit être au minimum de 8 caractères comprenant un caractère spécial, un chiffre, une lettre majuscule.', res) : null;
        !firstName ? resp.badRequest('Votre prénom n\'est pas valide', res) : null
        !lastName ? resp.badRequest('Votre nom n\'est pas valide', res) : null
    }
}
