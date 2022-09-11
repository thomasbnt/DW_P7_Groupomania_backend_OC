// TODO : Message resp Err 400 si input non conforme.
class RegexInputs {
  checkEmail(email) {
    if (email === undefined || email === '') {
      return false
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  checkPassword(password) {
    if (password === undefined || password === '') return false
    // Simple système de Regex pour vérifier le mot de passe.
    // Min 9 caractères, une lettre en majuscule, un caractère spécial et un chiffre.
    const regPassword = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
    )
    return regPassword.test(password)
  }

  checkText(input) {
    if (input === undefined || input === '') return false
    const regText = new RegExp('[a-zA-Z0-9]+')
    return regText.test(input)
  }
}

module.exports = new RegexInputs()
