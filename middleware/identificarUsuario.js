// Saber si un usuario o no esta identificado.

import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const identificarUsuario = async (req,res,next) => {
    
    // Identificar si hay un token en las cokkies.
    const {_token} = req.cookies //obtener el token.
    
    if(!_token) { // si no hay un token
        req.usuario = null //no hay ningun usuario osea nulo.
        return next()
    }

    // Comprobar el token
    try {

        const decoded = jwt.verify(_token, process.env.JWT_SECRET) // verifca el token y obtiene la informacion. para que pueda entrar
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id) //busca el primary key en ente caso en id del usuario.    - Despues usamos el scope del modelo Usuario para ocultar o eliminar parametros que no necesitamos.

        // console.log(usuario);
        // console.log(decoded);

        // Almacenar el usuario al req - Para que estea disponible en diferentes rutas.
        if(usuario){
            req.usuario = usuario;
        }

        return next();

    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login') // limpiamos la cokkie.
    }
}

export default identificarUsuario;