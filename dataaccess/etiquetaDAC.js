const database = require('../utils/dbConnection')
const mysql = require('mysql2')

async function checkTag(tag) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const checkEtiquetaQuery = "select * from etiqueta where lower(etiqueta) = lower(?);";

  var idEtiqueta = await db.promise().query(checkEtiquetaQuery, [tag]).then(([rows]) => {
    return rows[0]
  })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return idEtiqueta

}

async function insertTag(tag) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const insertEtiquetaQuery = "insert into etiqueta values (null,?);"

  const idEtiqueta = await db.promise().query(insertEtiquetaQuery, tag).then((result) => {
    return result[0].insertId
  })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return idEtiqueta
}

async function checkTagByPost(idtag_idpost) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const checkTag_PubQuery = "select * from etiqueta_por_publicacion where publicacion = ? and etiqueta = ?; "

  const checkTag_Pub = await db.promise().query(checkTag_PubQuery, [idtag_idpost.idPublicacion, idtag_idpost.idEtiqueta])
    .then(([rows]) => {
      return rows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return checkTag_Pub

}

async function insertTagByPost(idtag_idpost) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const insertTag_PubQuery = "insert into etiqueta_por_publicacion values (null, ?, ?); "

  const insertTag_Pub = await db.promise().query(insertTag_PubQuery, [idtag_idpost.idPublicacion, idtag_idpost.idEtiqueta])
    .then((result) => {
      return result
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return insertTag_Pub

}


async function filterTags(value) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const filterTagsQuery = "select distinct e.* from etiqueta e inner join etiqueta_por_publicacion et on e.idetiqueta = et.etiqueta " +
    "inner join publicacion p on et.publicacion = p.idpublicacion " +
    "where lower(e.etiqueta) like lower('" + value + "%') and p.estado='activo' order by e.etiqueta"

  const tags = await db.promise().query(filterTagsQuery)
    .then((rows) => {
      return rows[0]
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return tags

}


async function mostUsedTags(value) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const mostUsedTagsQuery = "select count(*) cont, e.idetiqueta, e.etiqueta from etiqueta e " +
  "inner join etiqueta_por_publicacion ep on e.idetiqueta = ep.etiqueta " +
  "inner join publicacion p on p.idpublicacion = ep.publicacion " + 
  "where p.estado = 'activo' " + 
  "group by e.idetiqueta, e.etiqueta " +
  "order by cont desc limit 0,5;"

  const tags = await db.promise().query(mostUsedTagsQuery)
    .then((rows) => {
      return rows[0]
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return tags

}


async function deleteOldTagsPost(oldTags) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const deleteOldTagsQuery = "delete from etiqueta_por_publicacion " +
  "where etiqueta not in (select idetiqueta from etiqueta where etiqueta in ("+oldTags.tags+")) " +
  "and publicacion = "+oldTags.idPublicacion+";"

  const deleteTags = await db.promise().query(deleteOldTagsQuery)
    .then((result) => {
      return result
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return deleteTags

}

module.exports = { insertTag, checkTag, checkTagByPost, insertTagByPost, filterTags, mostUsedTags, deleteOldTagsPost }