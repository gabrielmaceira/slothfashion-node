const DOMAINFRONT = process.env.NODE_ENV === 'production' ? 'https://slothfashion-react.herokuapp.com' : 'http://localhost:3000'
const DOMAINBACK = process.env.NODE_ENV === 'production' ? 'https://slothfashion-node.herokuapp.com' : 'http://localhost:4000'
const DOMAINSWAGGER = process.env.NODE_ENV === 'production' ? 'slothfashion-node.herokuapp.com' : 'localhost:4000'

const MP_SUCCESS = DOMAINFRONT + '/validateMPRequests'
const MP_FAILURE = DOMAINFRONT + '/validateMPRequests'
const MP_PENDING = DOMAINFRONT + '/validateMPRequests'

const MP_NOTIFICATION = process.env.NODE_ENV === 'production' ? DOMAINBACK+'/recibido' : 'gabriel-9332a330.localhost.run/recibido'
const MP_REDIRECT = process.env.NODE_ENV === 'production' ? DOMAINBACK+'/asociarcuentaMP' : 'gabriel-9332a330.localhost.run/asociarcuentaMP'
const MP_LINKACCOUNT = 'https://api.mercadopago.com/oauth/token'
/*  
MP_AUTH_URL_A B y C se usan para asociar la cuenta de mercadopago del usuario con el marketplace.
El cliente ID es el MARKETPLACEID en mercadopagoKey, y el state deberia ser el idusuario, que podria ir encriptado de alguna forma. A decidir si se llama al backend para pedir el link o se usa desde el front directamente
*/
const MP_AUTH_URL_A = 'https://auth.mercadopago.com.ar/authorization?client_id='
const MP_AUTH_URL_B = '&response_type=code&platform_id=mp&state='
const MP_AUTH_URL_C = '&redirect_uri='

module.exports = { DOMAINFRONT, DOMAINBACK, DOMAINSWAGGER, MP_SUCCESS, MP_FAILURE, MP_PENDING, MP_NOTIFICATION, MP_REDIRECT, MP_LINKACCOUNT,
  MP_AUTH_URL_A, MP_AUTH_URL_B, MP_AUTH_URL_C }