const comentarioDAC = require('../dataaccess/comentarioDAC')
const validators = require('../utils/validators')
const usuariosService = require('./usuariosService');


async function hacerComentario(comentario) {
    // validaciones
    const publicacionService = require('./publicacionService')
    try {
        validators.compararIds(comentario.body.comentador, comentario.tokenUserId,
            "Los datos de sesión no son válidos o no tenés acceso. Probá logueandote de nuevo.")
        validators.isGreaterThanZero(comentario.body.comentador, " El id de usuario debe ser mayor a 0 ")
        validators.isStringAndNotEmpty(comentario.body.comentario, "La descripción debe ser texto y no puede ser vacía.")
        validators.isGreaterThanZero(comentario.body.publicacion, " El id de la publicación debe ser mayor a 0 ")
        console.log(publicacionService)
        console.log(usuariosService)
        const existePost = await publicacionService.validarPublicacion(comentario.body.publicacion);
        const existeUser = await usuariosService.validarUsuario(comentario.body.comentador);
        if (existePost && existeUser) {
            await comentarioDAC.insertarComentario(comentario);
        } else {
            throw Error('La publicación o el usuario no existe');
        }

    }
    catch (error) {
        throw Error(error)
    }

};


async function getComments(postId) {
    // validaciones
    try {
        validators.isGreaterThanZero(postId, "El id de la publicacion debe ser mayor a 0")
        const comments = await comentarioDAC.getComments(postId)
        return comments

    }
    catch (error) {
        throw Error(error)
    }

};

module.exports = { hacerComentario, getComments };