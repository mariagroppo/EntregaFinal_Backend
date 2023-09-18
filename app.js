import express from 'express';
import ViewsRouter from './src/routes/views-router.js';
import SessionRouter from './src/routes/session-router.js';
import ProductsRouter from './src/routes/products-router.js';
import CartsRouter from './src/routes/carts-router.js';
import UsersRouter from './src/routes/users-router.js';
import __dirname from './utils.js';
import passport from 'passport';
import initializePassport from './src/passport/passport.js';
import config from './src/config/config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUiExpress from 'swagger-ui-express';

const app = express();
const PORT = config.app.PORT;
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/src/public'));

/* SESSION ---------------------------------------------------------------------------------------- */
app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo.URL,
        ttl: 12000,
        collectionName: 'sessions'
    }),
    secret: config.app.SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
initializePassport();

const swaggerOptions = {
    definition: {
        //version de API utilizada para documentar.
        openapi: '3.0.1',
        //Info que contiene la API.
        info: {
            title: "Ecommerce Coder Backend.",
            description: "Documentación del Ecommerce Coder Backend."
        }
    },
    //Ingresa a cualquier carpeta y archivo con extensión yaml
    apis: [`${__dirname}/src/docs/**/*.yaml`]
}

//Procesamiento de las especificaciones por Swagger
const specs = swaggerJSDoc(swaggerOptions);
//Se mete como middleware. Se inicializa con la configuracion de specs
app.use('/docs',SwaggerUiExpress.serve,SwaggerUiExpress.setup(specs))

const viewsRouter = new ViewsRouter();
const sessionRouter = new SessionRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const usersRouter = new UsersRouter();

app.use('/api/sessions', sessionRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/*', sessionRouter.getRouter());
app.use('/', viewsRouter.getRouter());
app.use('*', viewsRouter.getRouter())

//app.use('/api/chat', chatRouter.getRouter());


/* CONFIGURACION DE HANDLEBARS ------------------------------------------------------------------ */
import { engine } from 'express-handlebars';
app.set('view engine', 'hbs');
app.engine('hbs',engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: './src/views/layouts', // Ruta de la plantilla principal
    partialsDir: './src/views/partials', // Ruta de las plantillas parciales
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
      }
} ));

/* SOCKETS ----------------------------------------------------------------------------------------- */
/* import { Server } from 'socket.io';
import socketProducts from './src/sockets/sockets.js'; */

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`);
})

server.on("error", e=> console.log(`Error en el servidor ${e}`));
/* const socketServer = new Server(server); // socketServer sera un servidor para trabajar con sockets.
socketProducts(socketServer); */