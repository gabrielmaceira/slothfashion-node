const historialService = require('../services/historialService');

/**
 * @swagger
 * /getHistorial/{id}:
 *  get:
 *     tags:
 *     - historial
 *     summary: Obtiene el historial de compras/publicaciones de un usuario
 *     operationId: getHistorial
 *     description: Obtiene el historial de compras/publicaciones de un usuario
 *     parameters:
 *     - name: id
 *       type: string
 *       in: path
 *       required: true
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de Historial
 * 
 */

async function getHistorial(req, res) {

    const getHistorialDTO = {
        userId: req.params.id,
        tokenUserId: req.decoded.idusuario, // viene de validarUsuario
    }

    try {
        const post = await historialService.getHistorial(getHistorialDTO)
        return res.status(200).send(post)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

module.exports = { getHistorial };