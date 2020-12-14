const database = require('../utils/dbConnection')
const mysql = require('mysql2')

async function insertarComentario(comentario) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const insertComentarioQuery =
    "insert into comentario values(NULL,?,?,?,(select current_timestamp from dual));"

  const idComentario = await db.promise().query(insertComentarioQuery,
    [comentario.body.comentador, comentario.body.comentario, comentario.body.publicacion])
    .then((result) => {
      return result[0].insertId
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return idComentario

}


async function getComments(postId) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const getCommentsQuery =
    "select c.*, u.nombre from comentario c inner join usuario u on u.idusuario = c.comentador "+
    "where c.publicacion = ? order by c.fechacomentario DESC"

  const comments = await db.promise().query(getCommentsQuery, [postId])
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

module.exports = { insertarComentario, getComments };

