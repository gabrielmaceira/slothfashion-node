// SDK de Mercado Pago
const mercadopago = require('mercadopago');
const mercadopagoDAC = require('../dataaccess/mercadopagoDAC');
const axios = require('axios')
const URL = require('../constants/URL')
const MPKey = require('../constants/mercadopagoKey')
const validators = require('../utils/validators')

async function mercadoPagoRequest(mpLinkData) {
  const publicacionService = require('./publicacionService')
  // valida que el número del post sea mayor a cero
  try {
    validators.compararIds(mpLinkData.idBuyer, mpLinkData.tokenUserId,
      "Los datos de sesión no son válidos o no tenés acceso. Probá logueandote de nuevo.")
    validators.isGreaterThanZero(mpLinkData.idPost, "El id de la publicación debe ser un número mayor a cero.")
    validators.isGreaterThanZero(mpLinkData.idBuyer, "El id del usuario debe ser un número mayor a cero.")

    //busca los datos del post
    const postData = await publicacionService.getPost(mpLinkData.idPost)
    // busca los datos de la cuenta de mercadopago del usuario que hizo el post
    const userData = await getMPUserData(postData.post.poster)

    // Agrega las credenciales de mercadopago del usuario
    mercadopago.configure({
      access_token: userData.accesstoken
    })

    // Crea un objeto de preferencia, que tiene el item a comprar (de la publicacion), y los datos para redirigir luego de la compra
    var preference = {
      items: [],
      "back_urls": {
        "success": URL.MP_SUCCESS,
        "failure": URL.MP_FAILURE,
        "pending": URL.MP_PENDING
      },
      "auto_return": "approved",
      "notification_url": URL.MP_NOTIFICATION,
      "external_reference": mpLinkData.idPost + "-" + mpLinkData.idBuyer
    };

    // crea la compra y la envia al array items de la preference
    const purchase = {
      "title": postData.post.descripcion.slice(0, 20),
      "unit_price": postData.post.precio,
      "quantity": 1
    }

    preference.items.push(purchase)

    // crea el link de compra de mercadopago para ser redirigido
    const dataId = await mercadopago.preferences.create(preference)
      .then(function (response) {
        return response.body.init_point
      }).catch(function (error) {
        console.log(error)
        throw Error(error.data)
      });

    return dataId

  }
  catch (error) {
    throw Error(error)
  }

}

/* 
es llamado a traves de la url MP_AUTH_URL_A B y C (ver URL constants) para asociar la cuenta de mp del usuario 
con el marketplace
*/
async function linkMPAccount(props) {
  // valida que el state pasado por uri sea un número
  try {
    validators.isGreaterThanZero(props.state, "El id del usuario debe ser un número mayor a cero.")
    // revisa si ya existe una asociacion para la cuenta
    const existeCuenta = await existeCuentaMP(props.state)

    if (!existeCuenta) {

      const data = {
        'client_secret': MPKey.ACCESSKEY,
        'grant_type': 'authorization_code',
        'code': props.code,
        'redirect_uri': URL.MP_REDIRECT
      }

      // envia los datos a mercadopago que devuelve la informacion de pago del usuario, usada para generar los botones de compra
      var datosUserMP = await axios.post((URL.MP_LINKACCOUNT), data, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        }
      })
        .then(function (res) {
          if (res.status === 200) {
            return res.data
          }
        })
        .catch(function (err) {
          if (err.response) {
            console.log(err)
            throw Error("Hubo un error asociando tu cuenta de MercadoPago. Revisá en seguridad de tu cuenta si ya existen permisos para nuestra app, sino intentá nuevamente")
          }
        })

      datosUserMP = { ...datosUserMP, user: props.state }
      // se inserta la info de mercadopago del usuario en la base de datos
      const userID = await insertarUsuarioMP(datosUserMP)

      return userID
    }
    else {
      throw Error("Ya existe una entrada para este usuario en nuestra base de datos.")
    }
  }
  catch (error) {
    throw Error(error.data)
  }
}


async function insertarUsuarioMP(datosUserMP) {
  try {
    // crea una entrada en la base de datos para la informacion de mercadopago del usuario
    const userID = await mercadopagoDAC.insertarUsuarioMP(datosUserMP)
    return userID
  }
  catch (error) {
    throw Error(error)
  }
}


async function existeCuentaMP(userID) {
  try {
    // confirma si ya existe una cuenta de mercadopago asociada al usuario en la base de datos
    const existe = await mercadopagoDAC.existeCuentaMP(userID)

    return existe
  }
  catch (error) {
    throw Error(error)
  }
}


async function hasMPAcc(hasMPAccDTO) {
  try {
    // confirma si ya existe una cuenta de mercadopago asociada al usuario en la base de datos
    const userID = hasMPAccDTO.idUser

    validators.compararIds(userID, hasMPAccDTO.tokenUserId,
      "Los datos de sesión no son válidos o no tenés acceso. Probá logueandote de nuevo.")
    
    const existe = await mercadopagoDAC.existeCuentaMP(userID)

    if (existe) {
      return "exists"
    }
    else {
      return URL.MP_AUTH_URL_A+MPKey.MARKETPLACEID+URL.MP_AUTH_URL_B+userID+URL.MP_AUTH_URL_C+URL.MP_REDIRECT
    }
  }
  catch (error) {
    throw Error(error)
  }
}


async function getMPUserData(userID) {
  try {
    // busca los datos de la cuenta de mercadopago en la base de datos
    const userData = await mercadopagoDAC.getMPUserData(userID)

    return userData
  }
  catch (error) {
    throw Error(error)
  }
}

module.exports = { mercadoPagoRequest, linkMPAccount, existeCuentaMP, hasMPAcc }