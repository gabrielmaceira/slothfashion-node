const database = require('../utils/dbConnection')
const mysql = require('mysql2')

async function insertarUsuarioMP(datosUserMP) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const insertarUsuarioMPQuery = "insert into usuario_mercadopago (accesstoken, user_id_mp, refreshtoken, publickey, idusuario) values (?,?,?,?,?)";

  var idUsuarioMP = await db.promise().query(insertarUsuarioMPQuery,
    [datosUserMP.access_token, datosUserMP.user_id, datosUserMP.refresh_token, datosUserMP.public_key, datosUserMP.user])
    .then(([result]) => {
      return result.insertId
    })
    .catch((err) => {
      console.log(err)
      throw Error(err.data)
    })

  //cierre conexion DB
  db.close()

  return idUsuarioMP

}

async function existeCuentaMP(userID) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const existeCuentaMPQuery = "select count(*) as cont from usuario_mercadopago where idusuario = ?";

  var existeID = await db.promise().query(existeCuentaMPQuery,
    [userID])
    .then(([rows]) => {
      console.log("ROWS",rows[0])
      return rows[0].cont > 0
    })
    .catch((err) => {
      console.log(err)
      throw Error("No se pudo conectar a la base de datos. Intente más tarde.")
    })

  //cierre conexion DB
  db.close()

  return existeID

}


async function getMPUserData(userID) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const getMPUserDataQuery = "select * from usuario_mercadopago where idusuario = ?";

  var userData = await db.promise().query(getMPUserDataQuery,
    [userID])
    .then(([rows]) => {
      return rows[0]
    })
    .catch((err) => {
      console.log(err)
      throw Error("No se pudo conectar a la base de datos. Intente más tarde.")
    })

  //cierre conexion DB
  db.close()

  return userData

}

module.exports = { insertarUsuarioMP, existeCuentaMP, getMPUserData }