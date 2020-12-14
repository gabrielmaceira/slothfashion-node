const historialDAC = require('../dataaccess/historialDAC')
const validators = require('../utils/validators')


async function getHistorial(getHistorialDTO) {
    // validaciones
    try {
        validators.compararIds(getHistorialDTO.userId, getHistorialDTO.tokenUserId,
            "Los datos de sesión no son válidos o no tenés acceso. Probá logueandote de nuevo.")
        validators.isGreaterThanZero(getHistorialDTO.userId, "No es un post válido")
        const compras = await historialDAC.getHistorial(getHistorialDTO.userId)
        const publicaciones = await historialDAC.getPublicacionesByUser(getHistorialDTO.userId)
        const historial = { "compras": compras, "publicaciones": publicaciones }

        return historial
    }
    catch (error) {
        return Promise.reject(error)
    }
}

module.exports = { getHistorial }