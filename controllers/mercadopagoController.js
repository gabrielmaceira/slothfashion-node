const mercadopagoService = require('../services/mercadopagoService')
const URL = require('../constants/URL')

/**
 * @swagger
 * /mercadopago:
 *  post:
 *     tags:
 *     - mercado pago
 *     summary: Obtiene Link de Redireccion de Compra a Mercado Pago
 *     operationId: mercadoPagoRequest
 *     description: Obtiene Link de Redireccion de Compra a Mercado Pago
 *     parameters:
 *     - in: body
 *       name: post
 *       schema:
 *         $ref: '#/definitions/MercadoPago-Request'
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: URL obtenida
 *       401:
 *         description: El token de autorización o los datos de sesión no son válidos
 * 
 */

async function mercadoPagoRequest(req, res) {
    const mpLinkData = {
        idPost: req.body.idPost,
        idBuyer: req.body.idBuyer,
        tokenUserId: req.decoded.idusuario,
    }

    try {
        const data_preference_id = await mercadopagoService.mercadoPagoRequest(mpLinkData)
        return res.status(200).send(data_preference_id)
    }
    catch (error) {
        console.log(error)
        return res.status(401).send(error.message)
    }
}

/**
 * @swagger
 * /mpCheck:
 *  post:
 *     tags:
 *     - mercado pago
 *     summary: Chequea si el usuario tiene cuenta en MercadoPago
 *     operationId: hasMPAcc
 *     description: Chequea si el usuario tiene cuenta en MercadoPago
 *     parameters:
 *     - in: body
 *       name: post
 *       schema:
 *         $ref: '#/definitions/MercadoPago-CheckAccount'
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valor booleano de si existe o no la cuenta
 *       401:
 *         description: El token de autorización o los datos de sesión no son válidos
 * 
 */

async function hasMPAcc(req, res) {

    const hasMPAccDTO = {
        idUser: req.body.idUser,
        tokenUserId: req.decoded.idusuario
    }

    try {
        const existeCuentaMP = await mercadopagoService.hasMPAcc(hasMPAccDTO)
        return res.status(200).send(existeCuentaMP)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * /asociarcuentaMP:
 *  get:
 *     tags:
 *     - mercado pago
 *     summary: Asociar la cuenta de MercadoPago a la de SlothFashion
 *     operationId: linkMPAccount
 *     description: Asociar la cuenta de MercadoPago a la de SlothFashion
 *     parameters:
 *     - name: code
 *       type: string
 *       in: path
 *       required: true
 *       example: TG-5fbabf0a030c190006b33c2e-135526731
 *     - name: state
 *       type: string
 *       in: path
 *       required: true
 *       example: id del usuario
 *     responses:
 *       200:
 *         description: Redirecciona a la pagina de creación de publicaciones
 *       500:
 *         description: Error en el proceso de autorización de Mercado Pago
 * 
 */

async function linkMPAccount(req, res) {

    // se llamaria al abrir una pagina. i.e. 
    // https://auth.mercadopago.com.ar/authorization?client_id=6535661077233352&response_type=code&platform_id=mp&state=1&redirect_uri=http://gabriel-4a23db52.localhost.run/asociarcuentaMP

    const data = {
        code: req.query.code, // este es el access token
        state: req.query.state // el estado. se puede poner el idusuario
    }

    try {
        const mpUserData = await mercadopagoService.linkMPAccount(data)
        return res.status(200).redirect(URL.DOMAINFRONT + '/newpost')
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }

}

/**
 * @swagger
 * /recibido:
 *  post:
 *     tags:
 *     - mercado pago
 *     summary: Confirma la Compra realizada desde MercadoPago
 *     operationId: recibido
 *     description: Confirma la Compra realizada desde MercadoPago
 *     parameters:
 *     - in: body
 *       name: action
 *       schema:
 *         $ref: '#/definitions/Recibido'
 *     responses:
 *       200:
 *         description: Pago Recibido
 *       500:
 *         description: No se completó el pago
 * 
 */


function recibido(req, res) {
    console.log("PEPE")
    // es llamado una vez que se realiza un pago con mercadopago para ver si los datos son correctos de nuestro lado
    res.status(200).send("OK")
}

/**
 * @swagger
 * definitions:
 *   MercadoPago-Request:
 *     type: object
 *     properties:
 *           idPost:
 *             type: int
 *             example: 4
 *           idBuyer:
 *             type: int
 *             example: 10
 *   MercadoPago-CheckAccount:
 *     type: object
 *     properties:
 *           idUser:
 *             type: int
 *             example: 10
 *   Recibido:
 *     type: object
 *     properties:
 *       action:
 *         type: string
 *         example: payment.created
 */

module.exports = { mercadoPagoRequest, linkMPAccount, recibido, hasMPAcc };