const publicacionService = require('../services/publicacionService');
/**
* @swagger
* /addpost:
*  post:
*     tags:
*     - publicaciones
*     summary: Crea una publicación
*     operationId: hacerPublicacion
*     description: Crear una publicación
*     parameters:
*     - in: formData
*       name: file1
*       type: file
*       required: true
*       description: The file to upload.
*     - in: formData
*       name: file2
*       type: file
*       required: false
*       description: The file to upload.
*     - in: formData
*       name: file3
*       type: file
*       required: false
*       description: The file to upload.
*     - in: formData
*       name: file4
*       type: file
*       required: false
*       description: The file to upload.
*     - in: formData
*       name: data
*       type: string
*       format: json
*       required: true
*       description: Description of file contents.
*       value: '{"description":"descripcion item","price":"0","tags":"tag1 tag2","active":"activo","poster":1}'
*     security:
*     - bearerAuth: []
*       schema:
*         $ref: '#/definitions/Crear-Post'
*     responses:
*       200:
*         description: Publicacion Creada
* 
*/

async function hacerPublicacion(req, res) {

    const publicacionDTO = {
        body: JSON.parse(req.body.data), // datos de la publicacion
        uploadedFiles: req.files, // imagenes subidas
        tokenUserId: req.decoded.idusuario
    }

    try {
        const idPublicacion = await publicacionService.hacerPublicacion(publicacionDTO)
        return res.status(200).send(idPublicacion)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * /getpost/{id}:
 *  get:
 *     tags:
 *     - publicaciones
 *     summary: Obtiene una publicacion
 *     operationId: getPost
 *     description: Obtiene una publicación
 *     parameters:
 *     - name: id
 *       type: string
 *       in: path
 *       required: true
 *     responses:
 *       200:
 *         description: Publicacion Obtenida
 * 
 */

async function getPost(req, res) {
    const postId = req.params.id;

    try {
        const post = await publicacionService.getPost(postId)
        return res.status(200).send(post)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * /filterPosts:
 *  post:
 *     tags:
 *     - publicaciones
 *     summary: Filtra publicaciones
 *     operationId: filterPosts
 *     description: Filtra publicaciones creadas
 *     parameters:
 *     - in: body
 *       name: post
 *       schema:
 *         $ref: '#/definitions/Filtrar-Posts'
 *     responses:
 *       200:
 *         description: Publicaciones Filtradas Exitosamente
 * 
 */

async function filterPosts(req, res) {

    const filterPostsDTO = {
        body: req.body.data // tags, orderedby, ascdesc (ASC o DESC para ordenar) - ver tema de tipo?
    }

    try {
        const post = await publicacionService.filterPosts(filterPostsDTO)
        return res.status(200).send(post)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }

}

/**
 * @swagger
 * /patchBajaPublicacion/{id}:
 *  patch:
 *     tags:
 *     - publicaciones
 *     summary: Dar de baja una publicación
 *     operationId: patchBajaPublicacion
 *     description: Dar de baja una publicación
 *     parameters:
 *     - name: id
 *       type: string
 *       in: path
 *       required: true
 *     - name: idUsuario
 *       type: string
 *       in: path
 *       required: true
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Empty Response
 * 
 */

async function patchBajaPublicacion(req, res) {
    const bajaPublicacionDTO = {
        postId: req.params.id,
        userId: req.params.idusuario,
        tokenUserId: req.decoded.idusuario
    }

    try {
        const post = await publicacionService.patchBajaPublicacion(bajaPublicacionDTO)
        return res.status(200).send(post)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
* @swagger
* /editPost:
*  patch:
*     tags:
*     - publicaciones
*     summary: Editar una publicación
 *     operationId: editPost
 *     description: Editar una publicación
*     parameters:
*     - in: formData
*       name: file1
*       type: file
*       required: true
*       description: The file to upload.
*     - in: formData
*       name: file2
*       type: file
*       required: false
*       description: The file to upload.
*     - in: formData
*       name: file3
*       type: file
*       required: false
*       description: The file to upload.
*     - in: formData
*       name: file4
*       type: file
*       required: false
*       description: The file to upload.
*     - in: formData
*       name: data
*       type: string
*       format: json
*       required: true
*       description: Description of file contents.
*       value: '{"description":"descripcion item","price":"0","tags":"tag1 tag2","poster":1,"imagesModified": true, "postId":1, "active":"activo"}'
*     security:
*     - bearerAuth: []
*       schema:
*         $ref: '#/definitions/Editar-Post'
*     responses:
*       200:
*         description: Publicación Editada
* 
*/

async function editPost(req, res) {
    const publicacionDTO = {
        body: JSON.parse(req.body.data), // datos de la publicacion
        uploadedFiles: req.files, // imagenes subidas - si no hay cambios en las imagenes esta vacio
        tokenUserId: req.decoded.idusuario
    }

    try {
        await publicacionService.editPost(publicacionDTO)
        return res.status(200).send("La publicación se actualizó con éxito")
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * /hacerCompra:
 *  post:
 *     tags:
 *     - publicaciones
 *     summary: Ejecuta la Compra de una publicación
 *     operationId: hacerCompra
 *     description: Ejecuta la Compra de una publicación
 *     parameters:
 *     - in: body
 *       name: post
 *       schema:
 *         $ref: '#/definitions/Hacer-Compra'
 *     responses:
 *       200:
 *         description: Publicacion Comprada
 * 
 */

async function hacerCompra(req, res) {
    const publicacionDTO = {
        body: req.body,
    }

    try {
        await publicacionService.hacerCompra(publicacionDTO)
        return res.status(200).send("La compra se realizo con éxito.")
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * /getpublicaciones:
 *  get:
 *     tags:
 *     - publicaciones
 *     summary: Obtener lista de Publicaciones
 *     operationId: limitarPost
 *     description: Obtener lista de Publicaciones
 *     responses:
 *       200:
 *         description: Publicaciones Obtenidas
 * 
 */

async function limitarPost(req, res) {

    try {
        const post = await publicacionService.limitarPost()
        return res.status(200).send(post)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * definitions:
 *   Crear-Post:
 *     type: formData
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           description:
 *             type: string
 *             example: Publicacion 1
 *           price:
 *             type: string
 *             example: 200
 *           tags:
 *             type: string 
 *             example: tag1 tag2
 *           active:
 *             type: string 
 *             example: activo
 *           poster:
 *             type: int 
 *             example: 1
 *   Filtrar-Posts:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           ascdesc:
 *             type: string
 *             example: DESC
 *           orderedby:
 *             type: string
 *             example: fechaposteo
 *           tags:
 *             type: string 
 *             example: tag1 tag2
 *           page:
 *             type: int 
 *             example: 1
 *           max:
 *             type: int 
 *             example: 12
 *   Editar-Post:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           description:
 *             type: string
 *             example: Publicacion Editada
 *           price:
 *             type: string
 *             example: 200
 *           tags:
 *             type: string 
 *             example: tag1 tag2
 *           poster:
 *             type: int 
 *             example: 13
 *           imagesModified:
 *             type: boolean 
 *             example: false
 *           postId:
 *             type: int 
 *             example: 3
 *   Hacer-Compra:
 *     type: object
 *     properties:
 *       idPublicacion:
 *         type: int
 *         example: 4
 *       contraparte:
 *         type: int
 *         example: 13
 */

module.exports = { hacerPublicacion, getPost, filterPosts, patchBajaPublicacion, editPost, hacerCompra, limitarPost };