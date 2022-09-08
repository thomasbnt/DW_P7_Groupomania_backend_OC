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
        // si l'email est déjà dans la base de donnée, alors erreur
        signup.findOne({
            email: email
        }).then(async findEmail => {
            if (findEmail) {
                console.log('Email already exists');
                return resp.error('Email already exists', res);
            }
            if (findEmail === null) {
                // chiffre le password
                const hashPassword = await hash.gen(password)
                // si l'email n'est pas dans la base de donnée, alors on crée un nouvel utilisateur
                const newUser = new signup({
                    email: email,
                    password: hashPassword
                });
                newUser.save()
                    .then(() => {
                        console.log('A new signup has been created');
                        resp.success('Success: You are now signed up on Hot Takes.', res);
                    })
                    .catch(err => {
                        console.error(err);
                        resp.error("An error occurred while creating a new signup", res);
                    });
            }
        })
    } else {
        console.log('Email or password is not valid');
        !emailIsValid ? resp.error('Error: Email is required or you typed it wrong.', res) : null;
        !passwordIsValid ? resp.error('Error: Password is required (Make sure that you put at least 6 characters for security reasons).', res) : null;
    }
}
