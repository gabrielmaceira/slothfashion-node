const database = require('../utils/dbConnection')
const mysql = require('mysql2')

async function getHistorial(userId) {
    // creacion de la conexion a la DB
    var db = mysql.createConnection(database.dbInfo)

    const getHistorialQuery =
      "SELECT h.idhistorial, h.contraparte, u.nombre as Nombre, u.apellido as Apellido, u.mail as Mail, u.telefono as Telefono, h.fechatransaccion, " +
      "h.publicacion, p.poster, uu.nombre, uu.apellido, uu.mail, uu.telefono, p.descripcion, p.precio, p.fechaposteo, p.estado, i.imagen FROM historial h " +
      "INNER JOIN usuario u on h.contraparte = u.idusuario " +
      "INNER JOIN publicacion p on h.publicacion = p.idpublicacion " +
      "inner join usuario uu on p.poster = uu.idusuario " +
      "inner join imagen i on i.publicacion = p.idpublicacion " +
      "where h.contraparte = " + userId + " " +
      "and i.idimagen = (select min(idimagen) from imagen where publicacion = p.idpublicacion) " +
      "order by h.fechatransaccion desc"

    const historial = await db.promise().query(getHistorialQuery)
      .then(([rows]) => {
        return rows
      })
      .catch((err) => {
        console.log(err)
        throw Error(err)
      })
  
    //cierre conexion DB
    db.close()
  
    return historial
  
  }

  async function getPublicacionesByUser(userId) {
    // creacion de la conexion a la DB
    var db = mysql.createConnection(database.dbInfo)
  
    const getPublicacionesByUserQuery =
      "select p.*, u.nombre, u.apellido, u.mail, u.telefono, i.imagen, h.fechatransaccion, uu.nombre as nombreCont, " +
      "uu.apellido as apellidoCont, uu.mail mailCont, uu.telefono as telefonoCont from publicacion p " +
      "inner join usuario u on u.idusuario = p.poster " +
      "left join historial h on h.publicacion = p.idpublicacion " +
      "left join usuario uu on uu.idusuario = h.contraparte " +
      "inner join imagen i on i.publicacion = p.idpublicacion " +
      "where p.poster = ? " +
      "and i.idimagen = (select min(idimagen) from imagen where publicacion = p.idpublicacion) " +
      "order by h.fechatransaccion desc, p.fechaposteo desc"
  
    var post = await db.promise().query(getPublicacionesByUserQuery, [userId])
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

  module.exports = { getHistorial, getPublicacionesByUser }