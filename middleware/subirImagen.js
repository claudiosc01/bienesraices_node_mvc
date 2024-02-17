import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/tokens.js'

const storage = multer.diskStorage({
    destination: function(req, file, cb){ //si el callback se llega a llamar es que se esta subiendo correctamente la imagen.
        cb(null, './public/uploads/')
    },
    filename: function(req, file, cb){ // aca tambien si el callback se llega a llamar es que se esta subiendo correctamente la imagen.  | file.originalName > toma el nombre original del archivo. para que extraiga la extension del archivo.
        cb(null, generarId() + path.extname(file.originalname) ) // generamos un id, para que sea ese nombre.   - extname, trae la extension de un archivo y lo pone para que cuando subamos el generarId sea el nombre y le de la extension.

    }
})


const upload = multer({ storage }) //guardamos con la configuracion que creamos.


export default upload