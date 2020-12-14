const etiquetaDAC = require('../dataaccess/etiquetaDAC')
const validators = require('../utils/validators')

async function insertarEtiqueta(tagData) {
  try {
    // valida que el string de etiquetas tenga algun dato más que espacios
    validators.validateTags(tagData.etiquetas, "Las etiquetas no pueden estar vacías. Necesitan al menos un dato.")

    // divide el string de etiquetas tomando los espacios
    const tags = tagData.etiquetas.split(" ");

    for (const tag of tags) {
      if (tag.trim() !== '') {
        // para cada etiqueta revisa si ya existe en la tabla etiquetas. si no existe y no son solo espacios la inserta.
        var idEtiqueta = await etiquetaDAC.checkTag(tag)

        idEtiqueta = idEtiqueta !== undefined ? idEtiqueta.idetiqueta : 0

        if (idEtiqueta === 0 && tag.trim() !== '') {
          idEtiqueta = await etiquetaDAC.insertTag(tag)
        }

        const idtag_idpost = {
          idEtiqueta: idEtiqueta,
          idPublicacion: tagData.idPublicacion
        }
        /*     hace la insercion en la tabla de etiquetas por usuarios solamente si no existe ya una entrada para esa misma etiqueta
            para evitar duplicados */
        const checkTag_Pub = await etiquetaDAC.checkTagByPost(idtag_idpost)

        if (checkTag_Pub.length === 0) {
          await etiquetaDAC.insertTagByPost(idtag_idpost)
        }
      }
    }
  }
  catch (error) {
    throw Error(error)
  }
}


async function filterTags(value) {
  try {
    // usado para la search bar, que no tiene datos hasta que se empieza a tipear

    if (value.trim() !== '') {
      const tags = await etiquetaDAC.filterTags(value)
      return tags
    }

    else return null
  }
  catch (error) {
    throw Error(error)
  }
}


async function mostUsedTags() {
  try {
    // muestra las etiquetas mas usadas en publicaciones activas
    const tags = await etiquetaDAC.mostUsedTags()
    return tags
  }
  catch (error) {
    throw Error(error)
  }

}

async function deleteOldTagsPost(tagData) {
  try {
  // valida que el string de etiquetas tenga algun dato más que espacios
  validators.validateTags(tagData.etiquetas, "Las etiquetas no pueden estar vacías. Necesitan al menos un dato.")

  // divide el string de etiquetas tomando los espacios
  const tags = tagData.etiquetas.split(" ");
  var tagsString = ""

  for (const tag of tags) {
    if (tag.trim() !== "") {
      if (tagsString === "") {
        tagsString += "'" + tag + "'"
      }
      else {
        tagsString += ", '" + tag + "'"
      }
    }
  }

  const oldTags = {
    idPublicacion: tagData.idPublicacion,
    tags: tagsString
  }

  // borrado de etiquetas de la publicacion que no se encuentran dentro de las pasadas por parametro
  await etiquetaDAC.deleteOldTagsPost(oldTags)
}
catch (error) {
  throw Error(error)
}
}


module.exports = { insertarEtiqueta, filterTags, mostUsedTags, deleteOldTagsPost }