const express = require('express')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const path = require('path')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const { DOMAINSWAGGER } = require('./constants/URL')
const validarUsuario = require('./utils/validarUsuario')
var cors = require('cors')

const app = express();
const port = process.env.PORT || 4000;
//datos de ejemplo 
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    //openapi: '3.0.1',
    swagger: '2.0',
    info: {
      title: 'SlothFashion - Backend',
      version: '1.0.0'
    },
    host: DOMAINSWAGGER,
    basePath: '/',
    produces: ['application/json', 'multipart/form-data'],
    consumes: ['application/json', 'multipart/form-data'],
    schemes: 'http',
    securityDefinitions: {
      bearerAuth: {
        name: 'authorization',
        in: 'header',
        type: 'apiKey',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  apis: ['./controllers/*.js']
}); 

//incluyo los endpoints
const publicacion = require('./controllers/publicacionController')
const mercadopagoCont = require('./controllers/mercadopagoController')
const etiqueta = require('./controllers/etiquetaController')
const usuarios = require('./controllers/usuariosController')
const historial = require('./controllers/historialController')
const comentario = require('./controllers/comentarioController')

// configure 
app.set('port', port); // set express to use this port

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // de momento acepta todos los requests. ver dominio
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.use(cors());

//defino las rutas
app.post('/addpost', validarUsuario.validarUsuario, publicacion.hacerPublicacion)
app.patch('/patchBajaPublicacion/:id', validarUsuario.validarUsuario, publicacion.patchBajaPublicacion)
app.patch('/editPost', validarUsuario.validarUsuario, publicacion.editPost)
app.post('/hacerCompra', publicacion.hacerCompra)
app.post('/filterPosts', publicacion.filterPosts)
app.get('/getpost/:id', publicacion.getPost)
app.get('/getpublicaciones', publicacion.limitarPost)

app.get('/filtertags/:value', etiqueta.filterTags)
app.get('/mostUsedTags', etiqueta.mostUsedTags)

app.post('/mpCheck', validarUsuario.validarUsuario, mercadopagoCont.hasMPAcc)
app.post('/mercadopago', validarUsuario.validarUsuario, mercadopagoCont.mercadoPagoRequest)
app.get('/asociarcuentaMP', mercadopagoCont.linkMPAccount)
app.post('/recibido', mercadopagoCont.recibido) // aca iria la logica cuando la transaccion fue exitosa
//app.post('/recibido2', mercadopagoCont.recibido)

app.post('/signUp', usuarios.signUp)
app.post('/logIn', usuarios.logIn)

app.post('/hacerComentario', validarUsuario.validarUsuario, comentario.hacerComentario)
app.get('/getComentarios/:postId', comentario.getComments)

app.get('/getHistorial/:id', validarUsuario.validarUsuario, historial.getHistorial)

 app.listen(port, () => {
  console.log("ApiREST running on port: " + port);
}) 