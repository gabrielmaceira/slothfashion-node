const usuariosDAC = require('../dataaccess/usuariosDAC.js');
const validators = require('../utils/validators');
const encrypter = require('../utils/encrypter')
const jwt = require('jsonwebtoken')
const configJWT = require('../utils/configJWT')

async function signUp(signupDTO) {
    // validaciones
    try {
        validators.isStringAndNotEmpty(signupDTO.body.nombre, "El nombre no puede ser vacio.")
        validators.isStringAndNotEmpty(signupDTO.body.apellido, "El apellido no puede ser vacio.")
        validators.isStringAndNotEmpty(signupDTO.body.password, "el password no puede ser vacio.")
        validators.isStringAndNotEmpty(signupDTO.body.mail, "el mail no puede ser vacio.")
        validators.isStringAndNotEmpty(signupDTO.body.telefono, "El telefono no puede ser vacio.")

        signupDTO.body.password = encrypter.encrypt(signupDTO.body.password)

        return await usuariosDAC.signUp(signupDTO)

    }
    catch (error) {
        throw Error(error)
    }
}

async function logIn(loginDto) {
    // validaciones
    try {
        validators.isStringAndNotEmpty(loginDto.body.password, "el password no puede ser vacio.")
        validators.isStringAndNotEmpty(loginDto.body.mail, "el mail no puede ser vacio.")

        loginDto.body.password = encrypter.encrypt(loginDto.body.password)

        var result = await usuariosDAC.logIn(loginDto)
        if (result !== undefined) {
            
            const token = jwt.sign(JSON.stringify(result), configJWT.key); //sin expiracion

            result = {...result, token}
            return result

        } else {
            throw Error("Los datos ingresados no se corresponden a los de un usuario registrado")
        }
    }
    catch (error) {
        throw Error(error)
    }
}

async function validarUsuario(idUsuario) {
    try {
        validators.isGreaterThanZero(idUsuario, "El id de usuario debe ser un numero mayor a 0")
        const existeUsuario = await usuariosDAC.validarUsuario(idUsuario);
        return existeUsuario.length > 0;
    }
    catch (error) {
        throw Error(error)
    }
};

module.exports = { signUp, logIn, validarUsuario };