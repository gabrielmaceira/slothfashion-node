const database = require('../utils/dbConnection')
const mysql = require('mysql2')

async function insertarPublicacion(publicacion) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const insertPublicacionQuery =
    "insert into publicacion values(null,?,?,?,current_timestamp,?);"

  const idPublicacion = await db.promise().query(insertPublicacionQuery,
    [publicacion.body.poster, publicacion.body.description, publicacion.body.price, publicacion.body.active])
    .then((result) => {
      return result[0].insertId
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return idPublicacion

}

async function insertarImagen(imagen) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const insertImageQuery = "insert into imagen values(null,?,?);"
  await db.promise().query(insertImageQuery, [imagen.idPublicacion, imagen.image_name]).then((result) => {
    return result
  })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

}


async function getPost(postId) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const getPostDataQuery =
    "select p.*, u.mail from publicacion p inner join usuario u on u.idusuario = p.poster where p.idpublicacion=?"

  var post = await db.promise().query(getPostDataQuery, [postId])
    .then(([rows]) => {
      return rows[0]
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return post

}


async function getPostImages(postId) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const getPostImagesQuery =
    "select p.idpublicacion, i.idimagen, i.imagen from publicacion p " +
    "inner join imagen i on i.publicacion = p.idpublicacion where p.idpublicacion=?"

  const images = await db.promise().query(getPostImagesQuery, [postId])
    .then(([rows]) => {
      return rows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return images

}


async function getPostTags(postId) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const getPostTagsQuery =
    "select e.* from etiqueta e INNER join etiqueta_por_publicacion et on e.idetiqueta = et.etiqueta where et.publicacion = ?"

  const comments = await db.promise().query(getPostTagsQuery, [postId])
    .then(([rows]) => {
      return rows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return comments

}

async function filterPosts(filterP) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const getPostDataQuery =
    "select (select count(*) from publicacion p " +
    "inner join usuario u on u.idusuario = p.poster " +
    "inner join imagen i on i.publicacion = p.idpublicacion  " +
    "inner join etiqueta_por_publicacion ep on ep.publicacion = p.idpublicacion " +
    "inner join etiqueta e on e.idetiqueta = ep.etiqueta  " +
    "where i.idimagen = (select min(idimagen) from imagen where publicacion = p.idpublicacion)  " +
    "and p.estado = 'activo' and e.etiqueta in " + filterP.tagsString + ") as maxresults, p.*, u.mail, i.idimagen, i.imagen, "+
    "GROUP_CONCAT(e.idetiqueta, ' ', e.etiqueta SEPARATOR ' ') AS 'tags', " +
    "count(e.idetiqueta) 'relevancy' from publicacion p " +
    "inner join usuario u on u.idusuario = p.poster " +
    "inner join imagen i on i.publicacion = p.idpublicacion  " +
    "inner join etiqueta_por_publicacion ep on ep.publicacion = p.idpublicacion " +
    "inner join etiqueta e on e.idetiqueta = ep.etiqueta  " +
    "where i.idimagen = (select min(idimagen) from imagen where publicacion = p.idpublicacion)  " +
    "and p.estado = 'activo' " +
    " and e.etiqueta in " + filterP.tagsString +
    " group by p.idpublicacion, u.mail, i.idimagen, i.imagen " +
    " order by relevancy DESC, " + filterP.orderedby + " " + filterP.ascdesc +
    " limit ?,?;"

  const filteredPosts = await db.promise().query(getPostDataQuery, [filterP.min, filterP.max])
    .then((rows) => {
      return rows[0]
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return filteredPosts

}


async function patchBajaPublicacion(postId) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const patchBajaPublicacionQuery =
    "update publicacion set estado = 'inactivo' where idpublicacion = ?"

  const post = await db.promise().query(patchBajaPublicacionQuery, [postId])
    .then((result) => {
      return result.changedRows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return post

}


async function editPost(publicacion) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const editPostQuery =
    "update publicacion set descripcion=?, precio=?, fechaposteo=current_timestamp " +
    "where idpublicacion = ?"

  const edittedPost = await db.promise().query(editPostQuery,
    [publicacion.body.description, publicacion.body.price, publicacion.body.postId])
    .then((result) => {
      return result.changedRows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return edittedPost

}


async function removeImages(publicacion) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const removeImagesQuery =
    "delete from imagen where publicacion = ?"

  const removedImages = await db.promise().query(removeImagesQuery, [publicacion])
    .then((result) => {
      return result
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return removedImages

}


async function hacerCompra(publicacion) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const hacerCompraQuery =
    "INSERT INTO historial (idhistorial, contraparte, fechatransaccion, publicacion) VALUES (null," + publicacion.body.contraparte + " ,current_timestamp," + publicacion.body.idpublicacion + ");"

  await db.promise().query(hacerCompraQuery)
    .then(() => {
      return true
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

}


async function stateValidator(idpublicacion) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const checkState =
    "Select count(*) as cont from publicacion where idpublicacion = " + idpublicacion + " and estado = 'activo';"

  const validate = await db.promise().query(checkState)
    .then(([rows]) => {
      return rows[0].cont > 0
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return validate

}


async function validarPublicacion(postId) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)
  const validarPublicacionQuery =
    "select idpublicacion from publicacion where idpublicacion = ?"

  const idTraerPublicacion = await db.promise().query(validarPublicacionQuery, [postId])
    .then(([rows]) => {
      return rows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return idTraerPublicacion

}


async function validarPublicacion(postId) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)
  const validarPublicacionQuery =
    "select idpublicacion from publicacion where idpublicacion = ?"

  const idTraerPublicacion = await db.promise().query(validarPublicacionQuery, [postId])
    .then(([rows]) => {
      return rows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return idTraerPublicacion

}


async function limitarPost() {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)
  const limitarPostQuery =
    "select p.*, u.mail, i.idimagen, i.imagen, GROUP_CONCAT(e.idetiqueta, ' ', e.etiqueta SEPARATOR ' ') AS  'tags' " +
    "from publicacion p " +
    "inner join usuario u on u.idusuario = p.poster " +
    "inner join imagen i on i.publicacion = p.idpublicacion " +
    "inner join etiqueta_por_publicacion ep on ep.publicacion = p.idpublicacion " +
    "inner join etiqueta e on e.idetiqueta = ep.etiqueta " +
    "where i.idimagen = (select min(idimagen) from imagen where publicacion = p.idpublicacion) " +
    "and p.estado = 'activo' " +
    "group by p.idpublicacion, u.mail, i.idimagen, i.imagen " +
    "order by p.fechaposteo DESC " +
    "limit 0,20"

  const post = await db.promise().query(limitarPostQuery)
    .then(([rows]) => {
      return rows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return post

}


async function getIdPosterPub(postId) {
    // creacion de la conexion a la DB
    var db = mysql.createConnection(database.dbInfo)
    const getIdPosterPubQuery =
      "select poster from publicacion where idpublicacion=?"
  
    const idPoster = await db.promise().query(getIdPosterPubQuery,[postId])
      .then(([rows]) => {
        return rows
      })
      .catch((err) => {
        console.log(err)
        throw Error(err)
      })
  
    //cierre conexion DB
    db.close()
  
    return idPoster[0]
}


module.exports = {
  insertarPublicacion, insertarImagen, getPost, getPostImages, getPostTags, filterPosts,
  patchBajaPublicacion, editPost, removeImages, validarPublicacion, hacerCompra, stateValidator, limitarPost,
  getIdPosterPub
}