import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js';


import db from './config/db.js'

const app = express()

//Habilitar lectura para formulario para hacer peticiones
app.use( express.urlencoded({extended: true}) )




//Habilitar cookie-parser para las validaciones
app.use( cookieParser() )



//Habilitar CSRF
app.use( csrf({cookie: true}) ) 


//conexion a la db
try{
    await db.authenticate();
    db.sync() //generar tablas si no existen.
    console.log("Conexion correcta a la Base de datos")
}catch(error){
    console.log(error)
}

// set es para agregar configuracion - // Habilitar Pug
app.set('view engine', 'pug')
app.set('views','./views') //estaran en esta carpeta ./views



//main ruta auth
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes) //inicia con /
app.use('/api', apiRoutes)



// Carpeta Publica - Archivos estaticos
app.use( express.static('public') )


const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})

