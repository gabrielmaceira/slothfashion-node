const publicacionDAC = require('../dataaccess/publicacionDAC')
const etiquetaService = require('../services/etiquetaService')
const comentarioService = require('./comentarioService')
const mercadopagoService = require('./mercadopagoService')
const validators = require('../utils/validators')
const s3bucket = require('../utils/s3bucket')
const fs = require('fs');

async function validarPublicacion(idPublicacion) {
    try {
        validators.isGreaterThanZero(idPublicacion, "El id de usuario debe ser un numero mayor a 0")
        const existePublicacion = await publicacionDAC.validarPublicacion(idPublicacion);
        return existePublicacion.length > 0;
    }
    catch (error) {
        throw Error(error)
    }
};

async function hacerPublicacion(publicacion) {
    // validaciones
    try {
        validators.compararIds(publicacion.body.poster, publicacion.tokenUserId,
            "Los datos de sesión no son válidos o no tenés acceso. Probá logueandote de nuevo.")
        validators.floatIsNullOrGreaterThanZero(publicacion.body.price, "El precio debe ser nulo o un número mayor a cero.")
        validators.isStringAndNotEmpty(publicacion.body.description, "La descripción debe ser texto y no puede ser vacía.")
        validators.validateTags(publicacion.body.tags, "Las etiquetas sólo aceptan texto y no pueden estar vacías.")
        validators.isStringAndNotEmpty(publicacion.body.active, "La condición de activo sólo acepta texto")
        validators.isGreaterThanZero(publicacion.body.poster, "El id de usuario debe ser un entero")
        validators.arrayIsNotEmpty(publicacion.uploadedFiles, "Se debe cargar al menos una imagen")

        if (publicacion.body.price === '') {
            publicacion.body.price = 'NULL'
        }

        // valida que el usuario tenga cuenta de MercadoPago
        const hasMPAccDTO = {
            idUser: publicacion.body.poster,
            tokenUserId: publicacion.tokenUserId
        }
        const userHasMPAcc = await mercadopagoService.hasMPAcc(hasMPAccDTO)

        if (userHasMPAcc !== 'exists') {
            throw Error("No tenés cuenta de MercadoPago asociada, por asociala")
        }

        // intenta hacer la insercion de la publicacion
        const idPublicacion = await publicacionDAC.insertarPublicacion(publicacion);

        if (idPublicacion > 0) {
            const upFilesKeys = publicacion.uploadedFiles === null ? {} : Object.keys(publicacion.uploadedFiles)

            // loopea para insertar las imagenes asociadas a la publicacion
            const addFiles = async () => {
                for (let i = 0; i < upFilesKeys.length; i++) {
                    const key = upFilesKeys[i]
                    const output = await addFile(key, publicacion.uploadedFiles[key], idPublicacion);
                }
            }

            addFiles()

            const tagData = {
                etiquetas: publicacion.body.tags,
                idPublicacion: idPublicacion
            }
            // hace las inserciones de las etiquetas
            etiquetaService.insertarEtiqueta(tagData)
        }

        return { id: idPublicacion }

    }
    catch (error) {
        throw Error(error)
    }

}


async function getPost(postId) {
    // busca la informacion asociada a un post por id
    /* {"idpublicacion":11,"poster":1,"descripcion":"asdasd","precio":1,"fechaposteo":"2020-09-25T21:42:08.000Z",
    "estado":"activo","mail":"test@test.test","images":[{"idpublicacion":11,"idimagen":5,"imagen":"public/img/posts/11-file2.jpeg"},
    {"idpublicacion":11,"idimagen":6,"imagen":"public/img/posts/11-file1.jpeg"},
    {"idpublicacion":11,"idimagen":7,"imagen":"public/img/posts/11-file3.jpeg"}]} */

    // validacion
    try {
        validators.isGreaterThanZero(postId, "El id del post debe ser un entero")

        const post = await publicacionDAC.getPost(postId)
        const images = await publicacionDAC.getPostImages(postId)
        const comments = await comentarioService.getComments(postId)
        const tags = await publicacionDAC.getPostTags(postId)

        const fullPost = {
            post: post, images: images, comments: comments, tags: tags
        }

        return fullPost

    }
    catch (error) {
        throw Error(error)
    }
}


async function filterPosts(filterPostsDTO) {

    /* chequear el ordenar sea valido (lista de valores)
    ordenar deberia venir con algo por defecto
    se podria hacer una query para que ordene por mas relevante (la publicacion tiene mas de las tags ingresadas) 
    pero mariadb no tiene la funcion WITH que se estaria necesitando. se vera cuando se migre a mysql en heroku.
    
    tendria sentido ordenar por poster, precio, fechaposteo, mail y por relevancia.
    
    */

    try {
        validators.validateTags(filterPostsDTO.body.tags, "Las etiquetas sólo aceptan texto y no pueden estar vacías.")
        const tags = filterPostsDTO.body.tags.split(" ")

        var tagsString = ""
        for (const tag of tags) {
            if (tag.trim() !== "") {
                if (tagsString.length === 0) {
                    tagsString += `(\'` + tag.trim() + `\'`
                }
                else {
                    tagsString += `, \'` + tag.trim() + `\'`
                }
            }
        }
        tagsString += ')'

        const min = (filterPostsDTO.body.page - 1) * filterPostsDTO.body.max
        const max = filterPostsDTO.body.max

        const orderedby = filterPostsDTO.body.orderedby
        const ascdesc = filterPostsDTO.body.ascdesc
        const filterP = { tagsString, orderedby, ascdesc, min, max }

        const posts = await publicacionDAC.filterPosts(filterP)

        // se podria hacer una funcion auxiliar
        var nuevoPosts = []

        posts.map((post) => {
            const tags = []
            const tagArray = post.tags.split(" ")
            var i = 0

            while (i < tagArray.length) {
                const tag = {
                    idetiqueta: tagArray[i],
                    etiqueta: tagArray[i + 1]
                }
                tags.push(tag)
                i += 2
            }
            post = {
                ...post, tags: tags
            }
            nuevoPosts.push(post)
        })

        // hasta aca
        return nuevoPosts
    }
    catch (error) {
        throw Error(error)
    }
}


async function patchBajaPublicacion(bajaPublicacionDTO) {
    try {
        validators.compararIds(bajaPublicacionDTO.userId, bajaPublicacionDTO.tokenUserId,
            "Los datos de sesión no son válidos o no tenés acceso. Probá logueandote de nuevo.")
        validators.isGreaterThanZero(bajaPublicacionDTO.postId, "El id del post debe ser un entero")

        const post = await publicacionDAC.patchBajaPublicacion(bajaPublicacionDTO.postId)
        return post

    }
    catch (error) {
        throw Error(error)
    }
}


async function editPost(publicacion) {
    // validaciones
    try {

        const idPosterPub = await publicacionDAC.getIdPosterPub(publicacion.body.postId)
        validators.compararIds(publicacion.body.poster, publicacion.tokenUserId,
            "Los datos de sesión no son válidos o no tenés acceso. Probá logueandote de nuevo.")
        validators.compararIds(publicacion.body.poster, idPosterPub.poster,
            "Los datos de sesión no son válidos o no tenés acceso. Probá logueandote de nuevo.")
        validators.isGreaterThanZero(publicacion.body.postId, "No es un post válido")
        validators.floatIsNullOrGreaterThanZero(publicacion.body.price, "El precio debe ser nulo o un número mayor a cero.")
        validators.isStringAndNotEmpty(publicacion.body.description, "La descripción debe ser texto y no puede ser vacía.")
        validators.validateTags(publicacion.body.tags, "Las etiquetas sólo aceptan texto y no pueden estar vacías.")
        validators.isStringAndNotEmpty(publicacion.body.active, "La condición de activo sólo acepta texto")
        validators.isGreaterThanZero(publicacion.body.poster, "El id de usuario debe ser un entero")
        validators.arrayIsNotEmpty(publicacion.uploadedFiles, "Se debe cargar al menos una imagen")

        if (publicacion.body.price === '') {
            publicacion.body.price = 'NULL'
        }

        try {
            // intenta hacer la edicion de los datos de la publicacion
            await publicacionDAC.editPost(publicacion)

            if (publicacion.body.imagesModified) {
                const upFilesKeys = publicacion.uploadedFiles === null ? {} : Object.keys(publicacion.uploadedFiles)

                // borra las imagenes relacionadas a la publicacion si hubo cambios
                const imagePath = await getPostImages(publicacion.body.postId)

                // borra las imagenes de AWS
                const deleteFiles = async () => {
                    for (let i = 0; i < imagePath.length; i++) {
                        const imagePath = imagePath[i]
                        const output = await s3bucket.AWSDeleteFile(path)
                    }
                }

                deleteFiles()

                // borra las imagenes de la base de datos
                await publicacionDAC.removeImages(publicacion.body.postId)

                // loopea para insertar las imagenes asociadas a la publicacion
                const addFiles = async () => {
                    for (let i = 0; i < upFilesKeys.length; i++) {
                        const key = upFilesKeys[i]
                        const output = await addFile(key, publicacion.uploadedFiles[key], publicacion.body.postId);
                    }
                }

                addFiles()
            }

            const tagData = {
                etiquetas: publicacion.body.tags,
                idPublicacion: publicacion.body.postId
            }

            // borra las etiquetas asociadas a la publicacion que ya no pertenecen
            etiquetaService.deleteOldTagsPost(tagData)

            // hace las inserciones de las etiquetas
            etiquetaService.insertarEtiqueta(tagData)

        } catch (err) {
            throw Error(err)
        }

    }
    catch (error) {
        throw Error(error)
    }
}

async function getPostImages(postId) {
    // validaciones
    try {
        validators.isGreaterThanZero(postId, "No es un post válido")

        const images = await publicacionDAC.getPostImages(postId)
        return images

    }
    catch (error) {
        throw Error(error)
    }
}


const addFile = (key, file, idPublicacion) => {
    try {
        // guarda el la imagen en public/img/posts y si no hay errores lo sube a AWS S3
        var image_name = idPublicacion + '-' + key
        const fileExtension = file.mimetype.split('/')[1]
        image_name += '.' + fileExtension
        tempPathFile = 'public/img/posts/' + image_name

        return new Promise((r) =>
            file.mv(tempPathFile, async (err) => {
                if (err) {
                    throw Error(err)
                } else {
                    await s3bucket.AWSuploadFile(tempPathFile)
                    const imagen = {
                        image_name: image_name,
                        idPublicacion: idPublicacion
                    }
                    await publicacionDAC.insertarImagen(imagen)
                    fs.unlinkSync(tempPathFile)
                    return r("Exito " + tempPathFile)
                }
            }))
    }
    catch (error) {
        throw Error(error)
    }
}


async function hacerCompra(publicacion) {
    // validacion
    try {
        validators.isGreaterThanZero(publicacion.body.idpublicacion, "No es un post válido")
        validators.isGreaterThanZero(publicacion.body.contraparte, "El usuario es nulo o un número menor a cero.")

        const rows = await publicacionDAC.stateValidator(publicacion.body.idpublicacion)

        if (!rows) {
            throw Error("no se puede comprar este articulo.")
        }

        await publicacionDAC.hacerCompra(publicacion)
        await publicacionDAC.patchBajaPublicacion(publicacion.body.idpublicacion)
    }
    catch (error) {
        throw Error(error)
    }

}

async function limitarPost() {

    try {
        const posts = await publicacionDAC.limitarPost()

        // se podria hacer una funcion auxiliar
        var nuevoPosts = []

        posts.map((post) => {
            const tags = []
            const tagArray = post.tags.split(" ")
            var i = 0

            while (i < tagArray.length) {
                const tag = {
                    idetiqueta: tagArray[i],
                    etiqueta: tagArray[i + 1]
                }
                tags.push(tag)
                i += 2
            }
            post = {
                ...post, tags: tags
            }
            nuevoPosts.push(post)
        })

        return nuevoPosts
    }
    catch (error) {
        throw Error(error)
    }
}

module.exports = {
    hacerPublicacion, getPost, filterPosts, patchBajaPublicacion,
    editPost, getPostImages, validarPublicacion, hacerCompra, limitarPost
};

