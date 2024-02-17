import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const protegerRuta = async(req, res, next) => {

    // Verificar si hay un token
    // console.log(req.cookies._token); //extraer cookie
    const { _token } = req.cookies

    if(!_token){
        return res.redirect('auth/login')
    }



    // Comprobar el token - para autorizar acceso a la ruta main [/mis-propiedades] si el token no existe o es similar no se podra entrar.
    try {
        
        const decoded = jwt.verify(_token, process.env.JWT_SECRET) // verifca el token y obtiene la informacion. para que pueda entrar
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id) //busca el primary key en ente caso en id del usuario.    - Despues usamos el scope del modelo Usuario para ocultar o eliminar parametros que no necesitamos.

        // console.log(usuario);
        // console.log(decoded);

        // Almacenar el usuario al req - Para que estea disponible en diferentes rutas.
        if(usuario){
            req.usuario = usuario;
        }else{
            return res.redirect('/auth/login')
        }

        return next();

    } catch (error) {
        return res.clearCookie('_token').redirect('auth/login')
    }

}


export default protegerRuta