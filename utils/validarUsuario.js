const configJWT = require('./configJWT')
const jwt = require('jsonwebtoken')

function validarUsuario(req, res, next) {
  const token = req.headers['authorization']

  try {
    if (token === null || token === '') {
      throw Error(err)
    }
    else {
      jwt.verify(token, configJWT.key, (err, decoded) => {
        if (err) {
          throw Error(err)
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  }
  catch (err) {
    return res.status(401).send('El token no es válido o no tenés permiso para acceder')
  }

}

module.exports = { validarUsuario }