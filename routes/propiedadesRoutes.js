import express from 'express';
import { body } from 'express-validator' //

import { admin, agregarImagen, almacenarImagen, cambiarEstado, crear, editar, eliminar, enviarMensaje, guardar, guardarCambios, mostrarPropiedad, verMensajes } from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import identificarUsuario from '../middleware/identificarUsuario.js';

const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin)

router.get('/propiedades/crear', protegerRuta, crear)

router.post('/propiedades/crear',
    protegerRuta,

    body('titulo').notEmpty().withMessage('El titulo del anuncio es Obligatorio.'),
    body('descripcion')
        .notEmpty().withMessage('La descripcion no puede ir vacia.')
        .isLength({ max: 200}).withMessage("La Descripcion es muy larga"),
    body('categoria').isNumeric().withMessage('Selecciona una categoria.'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios.'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de Habitaciones.'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de Estacionamientos.'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de Baños.'),

    body('lat').notEmpty().withMessage('Ubica la propiedad en el Mapa.'),
    
    guardar
)


router.get('/propiedades/agregar-imagen/:id',
    protegerRuta, 
    agregarImagen
)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'), //soporta una imagen y sube la imagen.
    // upload.array() //soporta multiples imagenes
    // console.log('Subiendo imagen.');
    almacenarImagen
)   


router.get('/propiedades/editar/:id', 
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id',
    protegerRuta,

    body('titulo').notEmpty().withMessage('El titulo del anuncio es Obligatorio.'),
    body('descripcion')
        .notEmpty().withMessage('La descripcion no puede ir vacia.')
        .isLength({ max: 200}).withMessage("La Descripcion es muy larga"),
    body('categoria').isNumeric().withMessage('Selecciona una categoria.'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios.'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de Habitaciones.'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de Estacionamientos.'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de Baños.'),

    body('lat').notEmpty().withMessage('Ubica la propiedad en el Mapa.'),
    
    guardarCambios
)

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar

)


router.put('/propiedades/:id', 
    protegerRuta,
    cambiarEstado
)


// Area Publica
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
)


// Almacenar los mensajes.
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min: 15}).withMessage('El mensaje no puede ir vacio o es muy corto'),
    enviarMensaje
)

router.get('/mensajes/:id',
    protegerRuta,
    verMensajes    
)

export default router;