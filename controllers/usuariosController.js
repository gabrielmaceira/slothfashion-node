const usuariosService = require('../services/usuariosService.js');

/**
 * @swagger
 * /signUp:
 *  post:
 *     tags:
 *     - usuarios
 *     summary: Agrega un usuario
 *     operationId: signUp
 *     description: Agregar Usuarios
 *     parameters:
 *     - in: body
 *       name: usuario
 *       schema:
 *         $ref: '#/definitions/Usuario-SignUp'
 *     responses:
 *       200:
 *         description: Usuario agregado
 * 
 */

async function signUp(req, res) {

    console.log(req.body)
    const signupDTO = {
        body: req.body, // datos del signup
    }

    try {
        await usuariosService.signUp(signupDTO)
        return res.status(200).send("Tu cuenta se creo con exito.")
    }
    catch (error){
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * /logIn:
 *  post:
 *     tags:
 *     - usuarios
 *     summary: Loguea a un Usuario
 *     operationId: logIn
 *     description: Loguea Usuarios
 *     parameters:
 *     - in: body
 *       name: usuario
 *       schema:
 *         $ref: '#/definitions/Usuario-LogIn'
 *     responses:
 *       200:
 *         description: Usuario Logueado
 * 
 */

async function logIn(req, res) {

    const loginDTO = {
        body:req.body, // datos del login
    }

    try {
        const usuario = await usuariosService.logIn(loginDTO)
        console.log("USUARIO: ", usuario)
        return res.status(200).send(usuario)
    }
    catch (error){
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * definitions:
 *   Usuario-SignUp:
 *     type: object
 *     properties:
 *       nombre:
 *         type: string
 *         example: Juan
 *       apellido:
 *         type: string
 *         example: Perez
 *       password:
 *         type: string 
 *         example: Password123
 *       mail:
 *         type: string 
 *         example: juan@perez.com
 *       telefono:
 *         type: string 
 *         example: '1122223333'
 *   Usuario-LogIn:
 *     type: object
 *     properties:
 *       mail:
 *         type: string 
 *         example: juan@perez.com 
 *       password:
 *         type: string 
 *         example: Password123
 */

module.exports = { signUp, logIn };