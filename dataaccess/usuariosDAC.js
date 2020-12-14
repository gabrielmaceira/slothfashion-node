const database = require('../utils/dbConnection')
const mysql = require('mysql2')

async function signUp(signupDTO) {
    // creacion de la conexion a la DB
    var db = mysql.createConnection(database.dbInfo)

    const insertUsuario =
        "insert into usuario (idusuario, nombre, apellido, mail, password, telefono) values (null,?,?,?,?,?);"

    await db.promise().query(insertUsuario,
        [signupDTO.body.nombre, signupDTO.body.apellido, signupDTO.body.mail, signupDTO.body.password, signupDTO.body.telefono])
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

async function logIn(loginDTO) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)

  const selectUsuario =
    "select idusuario, nombre, apellido, mail from usuario where mail=? and password=?;"

  const usuario = await db.promise().query(selectUsuario,
      [loginDTO.body.mail, loginDTO.body.password])
  .then(([rows]) => { 
      return rows[0]
    })
  .catch((err) => {
      console.log(err)
      throw Error(err)
    })
  
  //cierre conexion DB
  db.close()
  return usuario
}

async function validarUsuario(usuarioId) {
  // creacion de la conexion a la DB
  var db = mysql.createConnection(database.dbInfo)
  const validarUsuarioQuery =
    "select idusuario from usuario where idusuario = ?" 

  const idTraerUsuario = await db.promise().query(validarUsuarioQuery, [usuarioId])
    .then(([rows]) => {
      return rows
    })
    .catch((err) => {
      console.log(err)
      throw Error(err)
    })

  //cierre conexion DB
  db.close()

  return idTraerUsuario

}

module.exports = { signUp, logIn, validarUsuario }