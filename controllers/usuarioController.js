import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailOlvidePassword, emailRegistro } from '../helpers/emails.js'


const formularioLogin = (req ,res) => {
    res.render('auth/login',{
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken() 
    })
}

const autenticar = async (req , res) => {

    // Validacion
    await check('email').isEmail().withMessage('El email es Obligatorio.').run(req) //valida email 
    await check('password').notEmpty().withMessage('El password es Obligatorio.').run(req) 

    let resultado = validationResult(req) //tenemos todos los errores


    //return res.json(resultado.array()) //ver resultado para poder verificiar errors, etc.

    //verificar si el resultado esta vacio.
    if(!resultado.isEmpty()){ //el usuario no esta vacio por lo tanto hay errores.
        
        return res.render('auth/login',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
            errores: resultado.array(), //usamos array para poder iterar los elementos o tambien ver errores.
        })
    }

    const { email, password } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email: email}})
    if(!usuario){
        return res.render('auth/login',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
            errores: [{msg: 'El usuario no existe.'}]
        })
    }

    // Comprobando si el usuario esta confirmado.
    if(!usuario.confirmado){     //si el usuario no esta confirmado pero si existe.
        return res.render('auth/login',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
            errores: [{msg: 'Tu cuenta aun no ha sido confirmada.'}]
        })
    }

    //Revisar el Password hasheado...
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
            errores: [{msg: 'El password es incorrecto.'}]
        })
    }
    

    // Autenticar al usuario...
    const token = generarJWT(usuario.id) // pa que tome el id del usuario y le agregue un token
    //const token = generarJWT({id: usuario.id, nombre: usuario.nombre}) // otra forma de agregar mas datos en el token

    // console.log(token); //ver token

    // Almacenar en un Cokkie
    return res.cookie('_token', token,{// dar un nombre al cokkie
        httpOnly: true,    //evitar ataques cross site, para que no sea accesible desde la aip de javascript.
        // expires: 9000
        // secure: true     //solo va a permiter en conexiones seguras.
        // sameSite: true
    }).redirect('/mis-propiedades')
}



const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login');
}




const formularioRegistro = (req ,res) => {

    // console.log(req.csrfToken()); // registrar el token csrf


    res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken() //va a generar el token cada que visitamos.
    })
}



const registrar = async (req,res) => {
    // console.log(req.body) //leer informacion

    //validacion para crear cuenta...
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req) //valida nombre si no esta vacio donde req
    await check('email').isEmail().withMessage('No tiene el formato de un Email.').run(req) //valida email 
    await check('password').isLength({ min: 6}).withMessage('El password debe ser de al menos de 6 caracteres').run(req) //validar password
    await check('repetir_password').equals(req.body.password).withMessage('Los Password no son iguales').run(req) 

    let resultado = validationResult(req) //tenemos todos los errores


    //return res.json(resultado.array()) //ver resultado para poder verificiar errors, etc.

    //verificar si el resultado esta vacio.
    if(!resultado.isEmpty()){ //el usuario no esta vacio por lo tanto hay errores.
        
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
            errores: resultado.array(), //usamos array para poder iterar los elementos o tambien ver errores.
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }



    //Extraer los datos
    const { nombre, email, password} = req.body //desestructurar los parametros del req.body para poder usarlo por el nombre.

    //verificar que el usuario no este duplicado por email
    const existeUsuario = await Usuario.findOne( { where: { email: email} }) //busca el usuario por el email enviado y nos muestra el resultado de la bd, si no existe nos devolvera un null.

    if(existeUsuario){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
            errores: [{msg: 'El usuario ya esta registrado.'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    //Almacenar el usuario un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // Envia email de confirmacion, tomamos los paarametros para poder ser usada en el envio del mensaje.
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token

    })



    //Mostrar mensaje de confirmacion - no es una pagina, esto remplaza todo el contenido que habia por el contenido renderizado.
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente.',
        mensaje: 'Hemos enviado un Email de confirmacion, presiona en el enlace.'
    })

    //console.log(existeUsuario);

    //de lo contrario hacemos esto
    // const usuario = await Usuario.create(req.body)
    
    //muestra el json creado de usuario.
    // res.json(usuario)
}

//Funcion que comprueba una cuenta.
const confirmar = async (req,res, next) => {

    const { token } = req.params;

    console.log(token); //hace lo mismo usando desustruracion.
    // console.log(req.params.token); //obtener la variable despues de la ruta /confirmar/ 

    // Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: {token: token}}) //busca el token en la bd si existe.

    if(!usuario){ //si no existe el token
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Error al confirmar tu cuenta.',
            mensaje: 'Hubo un error al confirmar tu cuenta. Intenta de nuevo.',
            error: true
        })
    }
    
    // Confirmar la cuenta
    // console.log(usuario.token);
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save(); //guarda los cambios

    res.render('auth/confirmar-cuenta',{
        pagina: 'Cuenta confirmada.',
        mensaje: 'La cuenta se confirmo Correctamente.'
    })


    // next(); //va al siguente middlewer
}


const formularioOlvidePassword = (req ,res) => {
    res.render('auth/olvide-password',{
        pagina: 'Recuperar tu Acceso a Bienes Raices',
        csrfToken: req.csrfToken() //va a generar el token cada que visitamos.
    })
}


//Codigo donde enviamo el email para que pueda resetear su password.
const resetPassword = async (req ,res) => {
        //validacion email...
        await check('email').isEmail().withMessage('No tiene el formato de un Email.').run(req) //valida email 

    
        let resultado = validationResult(req) //tenemos todos los errores
    
    
        //return res.json(resultado.array()) //ver resultado para poder verificiar errors, etc.
    
        //verificar si el resultado esta vacio.
        if(!resultado.isEmpty()){ //el usuario no esta vacio por lo tanto hay errores.
            
            return res.render('auth/olvide-password',{
                pagina: 'Recupera tu Acceso a BienesRaices',
                csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
                errores: resultado.array()
            })
        }


        //Buscar el usuario en la bd.
        const { email } = req.body

        const usuario = await Usuario.findOne({ where: {email: email}}) //busca el email si existe en la bd.
        // console.log(usuario);

        if(!usuario){ //si no exsite el email en la bd
            return res.render('auth/olvide-password',{
                pagina: 'Recupera tu Acceso a BienesRaices',
                csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
                errores: [{msg: 'El email no pertenece a ningun usuario'}]
            })
        }



        // Generar un Token y enviar el Email
        usuario.token = generarId() //genera un id.
        await usuario.save() //guarda los cambios


        // Enviar email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        // Renderizar un mensaje
        res.render('templates/mensaje', {
            pagina: 'Restablece Tu Password',
            mensaje: 'Hemos enviado un Email con las intrucciones, presiona en el enlace.'
        })


}   


const comprobarToken = async (req, res) => {
    const { token } = req.params

    const usuario = await Usuario.findOne({ where: {token: token}}) //busca el token en la bd si existe del usuario, y nos trae el usuario.

    if(!usuario){ //si no existe el usuario.
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Restablece Tu Password.',
            mensaje: 'Hubo un error al validar tu informacion. Intenta de nuevo.',
            error: true
        })
    }

    // En caso que sea valido, mostrar formulario para que agregue un nuevo password.
    res.render('auth/reset-password', {
        pagina: 'Restablece Tu Password.',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {

    // Validar el Password
    await check('password').isLength({ min: 6}).withMessage('El password debe ser de al menos de 6 caracteres').run(req) //validar password
    
    let resultado = validationResult(req) //tenemos todos los errores


    //return res.json(resultado.array()) //ver resultado para poder verificiar errors, etc.

    //verificar si el resultado esta vacio.
    if(!resultado.isEmpty()){ //el usuario no esta vacio por lo tanto hay errores.
        
        return res.render('auth/reset-password',{
            pagina: 'Restablece Tu Password',
            csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
            errores: resultado.array(), //usamos array para poder iterar los elementos o tambien ver errores.
        })
    }

    const { token } = req.params
    const { password } = req.body
    
    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token: token}})

    //Hashear el password
    const salt = await bcrypt.genSalt(10) //genera el hash para hashear el password
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save() //guardar cambios.

    res.render('auth/confirmar-cuenta',{
        pagina: 'Restablece Tu Password.',
        mensaje: 'Tu password se ha cambiado correctamente.'
    })


}


export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    cerrarSesion
}