const resp = require('../modules/responses');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // Si le token n'est pas présent, on renvoie une erreur
        if (token === null) return resp.invalidCredentials('Invalid credentials', res);

        // On décode le token
        jwt.verify(token, process.env.KEY, (err, user) => {
            if (err) return resp.forbidden('Forbidden.', res);
            req.user = user;
            next();
        })

    } catch (error) {
        console.log(error);
        return resp.internalError(error, res);
    }
}
