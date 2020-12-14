const comentarioService = require('../services/comentarioService');

/**
 * @swagger
 * /hacerComentario:
 *  post:
 *     tags:
 *     - comentarios
 *     summary: Hacer un Comentario
 *     operationId: hacerComentario
 *     description: Hacer un Comentario
 *     parameters:
 *     - in: body
 *       name: post
 *       schema:
 *         $ref: '#/definitions/Comentario'
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comentario publicado exitosamente
 * 
 */

async function hacerComentario(req, res) {
    const comentarioDTO = {
        body: req.body,
        tokenUserId: req.decoded.idusuario, // viene de validarUsuario
    }

    try {
        const idComentario = await comentarioService.hacerComentario(comentarioDTO)
        return res.status(200).send('Gracias por dejar un comentario.')
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * /getComentarios/{postId}:
 *  get:
 *     tags:
 *     - comentarios
 *     summary: Obtiene los comentarios de una publicación
 *     operationId: getComments
 *     description: Obtiene los comentarios de una publicación
 *     parameters:
 *     - name: postId
 *       type: string
 *       in: path
 *       required: true
 *     responses:
 *       200:
 *         description: Datos del Comentario
 * 
 */

async function getComments(req, res) {
    const getCommentsDTO = req.params.postId 

    try {
        const comments = await comentarioService.getComments(getCommentsDTO)
        return res.status(200).send(comments)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * definitions:
 *   Comentario:
 *     type: object
 *     properties:
 *       comentador:
 *         type: int
 *         example: 9
 *       comentario:
 *         type: string
 *         example: COMENTARIO TEST
 *       publicacion:
 *         type: int 
 *         example: 4
 */

module.exports = { hacerComentario, getComments };