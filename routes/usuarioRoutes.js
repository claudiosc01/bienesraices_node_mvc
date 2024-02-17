import express from 'express';
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword, comprobarToken, nuevoPassword, autenticar, cerrarSesion } from '../controllers/usuarioController.js'

const router = express.Router();

router.get('/login', formularioLogin)
router.post('/login', autenticar)


//Cerrar Sesion
router.post('/cerrar-sesion', cerrarSesion)


router.get('/registro', formularioRegistro)
router.post('/registro', registrar)


router.get('/confirmar/:token', confirmar) //cualquier valor desde de /confirmar/ sera una variable, lo leera.           - Routing Dinamico.


router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)


//Almacenar el nuevo password
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)



export default router;








//Otra forma de usar.----
// router.route('/')
//     .get((req,res)=>{
//         res.json({msg: 'Get Router'})
//     })
//     .post((req,res)=>{
//         res.json({msg: 'Post Router'})
//     })