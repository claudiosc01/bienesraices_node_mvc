import { unlink } from 'node:fs/promises' // servira para eliminar la imagen
import { validationResult } from "express-validator"; //leera el resultado llamado desde propiedadesRoutes el body.
import { Precio, Categoria, Propiedad, Usuario } from "../models/index.js";
import { esVendedor, formatearFecha } from '../helpers/index.js' 
import Mensaje from '../models/Mensaje.js';

// import Categoria from "../models/Categoria.js"
// import Precio from "../models/Precio.js"

const admin = async (req, res) => {

  //Leer Query-String
  //console.log(req.query); // hace referencia al query osea /pagina=1    veremos el 1 asi sucesivamente segun el numero que pongamos
  //console.log(req.query.pagina); // hace referencia al query osea /pagina=1 y nos dara el valor donde es 1.

  const { pagina: paginaActual } = req.query  //extramos el query de pagina.s
  //console.log(paginaActual);
  const expresion = /^[1-9]$/       //para decirle donde inicia y donde termina. y acepta digitos del 0 al 9              ^ = siempre tiene que iniciar con digitos       $ = siempre tiene que finalizar con digitos.

  if(!expresion.test(paginaActual)){ // comprobar si esta en el rango de la expresion. - | > pero cuando le ponemos ! le dicemos en caso de que no exista.
    return res.redirect('/mis-propiedades?pagina=1')
  }

  try {
    const { id } = req.usuario //extraer el usuario
    //console.log(id);
    
    // Limites y Offset para el paginador
    const limit = 4 //cada pagina tendra 4 registros.
    const offset = ((paginaActual * limit) - limit) // es decir 1 * 10 - 10 = 0    > para la pagina 1. para la pagina 2 seria: 2 * 10 - 10 = 10 // esto se salta los primeros 10 registros. asi sucesivamente.

    const [propiedades, total] = await Promise.all([
      await Propiedad.findAll({ //aplicamos una consulta para verificar el usuario con el id del usuario y extraemos todo sus datos de propiedad.
        limit,
        offset,
        where: {
          usuarioId: id, //verifica el id.
        },
        include: [
          { model: Categoria, as: 'categoria'},
          { model: Precio, as: 'precio'},
          { model: Mensaje, as: 'mensajes'}
        ]
      }),

      Propiedad.count({
        where: {
          usuarioId: id, // para contar cuantas propidades hay de este usuario. para saber cuantas pagina tengo que crear. - trae la cantidad total.
        }
      })
    ])
    
    //console.log(total); // ver cantidad de propeidades.

    res.render("propiedades/admin", {
      pagina: "Mis Propiedades",
      propiedades,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total / limit), //esto obtendra el paginador, math.ceil redondea a el numero mayor.
      paginaActual: Number(paginaActual), // retorna el numero de la pagina donde nos encontramos.
      total,
      offset,
      limit
    });
  } catch (error) {
    console.log(error);
  }




};




// Formulario para crear una propiedad
const crear = async (req, res) => {
  // Consultar Modelo de Precio y Categorias
  const [categorias, precios] = await Promise.all([
    //categorias, precios se llena con la busqueda de findAll de la bd.
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
    categorias: categorias,
    precios: precios,
    datos: {},
  });
};





const guardar = async (req, res) => {
  // Validacion
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //el usuario no esta vacio por lo tanto hay errores.

    // Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
      //categorias, precios se llena con la busqueda de findAll de la bd.
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    return res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      barra: true,
      csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
      categorias: categorias,
      precios: precios,
      errores: resultado.array(),
      datos: req.body,
    });
    }

    // en caso que la validacion pase correctamente. - Crear un registro

    const {
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precio,
      categoria,
    } = req.body; // desustructurar

    // console.log(req.usuario.id); // obtener usuarioId
    const { id: usuarioId,  } = req.usuario;
    const { precio:precioId, categoria:categoriaId } = req.body;

    // console.log(req.body);

    try {
      const propiedadGuardada = await Propiedad.create({
        titulo,
        descripcion,
        habitaciones,
        estacionamiento,
        wc,
        calle,
        lat,
        lng,
        precioId,
        categoriaId,
        usuarioId,
        imagen: "",
      });

      const { id } = propiedadGuardada;
      res.redirect(`/propiedades/agregar-imagen/${id}`);
    } catch (error) {
      console.log(error);
    }
};


const agregarImagen = async (req, res) => {
  
  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id); // busca si existe el primary key 

  if(!propiedad) { // si no existe esta propiedad.
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad no este publicada   //si esta en 0 no mostrara, si esta en 1 si mostrara.
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad pertenece a quien visita esta pagina
  //console.log(req.usuario); //ver el usuario.  - pero primero necesitamos importar en las rutas protegerRuta para que nos traiga el usuario.
  
  //veremos que son los mismos Ids.
  // console.log(req.usuario.id.toString()); // convierte a string
  // console.log(propiedad.usuarioId.toString());

  //Si el usuario autenticado es diferente a la propiedad que esta autenticado no es la misma persona. o si el usuario que visita otra piedad es diferente al usuarioId, no puedan verlo.
  if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
    return res.redirect('/mis-propiedades')
  }



  res.render('propiedades/agregar-imagen', {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad
  })

}


const almacenarImagen = async (req, res, next) => {
  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id); // busca si existe el primary key 

  if(!propiedad) { // si no existe esta propiedad.
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad no este publicada   //si esta en 0 no mostrara, si esta en 1 si mostrara.
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades')
  }

  //Si el usuario autenticado es diferente a la propiedad que esta autenticado no es la misma persona. o si el usuario que visita otra piedad es diferente al usuarioId, no puedan verlo.
  if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
    return res.redirect('/mis-propiedades')
  }


  // Leer el archivo y obtener, para almacenarlo a la bd.
  try {
    //Almacenar la imagen y publicar propiedad
    
    //console.log(req.file); //sera el archivo subido. nos dara toda la informacion del archivo subido.
    propiedad.imagen = req.file.filename
    propiedad.publicado = 1 // 1 = ya va a estar publicado

    await propiedad.save()
    next()


  } catch (error) {
    console.log(error);
  }
}


const editar = async (req,res) => {

    const { id } = req.params //extraer el id de la url.

    // Validar que la propiedad exista.
    const propiedad = await Propiedad.findByPk(id); // busca si existe el primary key

    if(!propiedad){
      return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la url es quien ha creado la propiedad - en caso que sean diferentes los ids
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
      return res.redirect('/mis-propiedades')
    }


    // Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
      //categorias, precios se llena con la busqueda de findAll de la bd.
      Categoria.findAll(),
      Precio.findAll(),
    ]);
    
    res.render("propiedades/editar", {
      pagina: `Editar Propiedad: ${propiedad.titulo}`,
      csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
      categorias: categorias,
      precios: precios,
      datos: propiedad
    });
} 


const guardarCambios = async (req, res) => {

  
  // Validacion
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {

    //el usuario no esta vacio por lo tanto hay errores.
  
    // Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
    //categorias, precios se llena con la busqueda de findAll de la bd.
      Categoria.findAll(),
      Precio.findAll(),
    ]);
  
    return res.render("propiedades/editar", {
      pagina: "Editar Propiedad",
      csrfToken: req.csrfToken(), //va a generar el token cada que visitamos.
      categorias: categorias,
      precios: precios,
      errores: resultado.array(),
      datos: req.body
    });
  }


  const { id } = req.params //extraer el id de la url.

  // Validar que la propiedad exista.
  const propiedad = await Propiedad.findByPk(id); // busca si existe el primary key


  // Si no existe... hacemos esto.
  if(!propiedad){
    return res.redirect('/mis-propiedades')
  }

  // Revisar que quien visita la url es quien ha creado la propiedad - en caso que sean diferentes los ids
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
    return res.redirect('/mis-propiedades')
  }


  // Reescribir el Objeto y actualizarlo.
  try {
    // console.log(propiedad);
    const {
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precio: precioId,
      categoria: categoriaId,
    } = req.body; // desustructurar


    propiedad.set({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId,
      categoriaId
    })

    await propiedad.save() // guarda cambios

    res.redirect('/mis-propiedades')



  } catch (error) {
    console.log(error);
  }

}



const eliminar = async (req,res) => {
  // console.log('Eliminando');
  const { id } = req.params //extraer el id de la url.

  // Validar que la propiedad exista.
  const propiedad = await Propiedad.findByPk(id); // busca si existe el primary key


  // Si no existe... hacemos esto.
  if(!propiedad){
    return res.redirect('/mis-propiedades')
  }

  // Revisar que quien visita la url es quien ha creado la propiedad - en caso que sean diferentes los ids
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
    return res.redirect('/mis-propiedades')
  }


  // Eliminar la imagen asociada.
  await unlink(`public/uploads/${propiedad.imagen}`)

  console.log(`Se elimino la imagen ${propiedad.imagen}`);

  // Eliminar la propiedad
  await propiedad.destroy();
  res.redirect('/mis-propiedades')

}


// Modificar el estado de la propiedad
const cambiarEstado = async (req,res) => {

  // console.log("cambiando estado");
  const { id } = req.params //extraer el id de la url.

  // Validar que la propiedad exista.
  const propiedad = await Propiedad.findByPk(id); // busca si existe el primary key
  
  
  // Si no existe... hacemos esto.
  if(!propiedad){
    return res.redirect('/mis-propiedades')
  }

  // Revisar que quien visita la url es quien ha creado la propiedad - en caso que sean diferentes los ids
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
    return res.redirect('/mis-propiedades')
  }


  // console.log(propiedad);


  // Actualizar Propiedad el Estado.
  propiedad.publicado = !propiedad.publicado  //lo que hara es si esta en 1 lo pasa a 0 y si esta en 0 lo pasa a 1.

  await propiedad.save();

  res.json({
    resultado: true
  })

}




// Muestra una propiedad
const mostrarPropiedad = async (req, res) => {
  
  // Validar o comprobar que la propiedad exista
  const { id } = req.params;

  // console.log(req.usuario);

  // Es una forma de unir modelos para unir tablas.
  const propiedad = await Propiedad.findByPk(id,{
    include: [
      { model: Categoria, as: 'categoria'},
      { model: Precio, as: 'precio'},
    ]
  });
  



  if(!propiedad || !propiedad.publicado){
    return res.redirect('/404') // Envia a la pagina 404 osea error. porque no existe.
  }


  // console.log( esVendedor(req.usuario?.id, propiedad.usuarioId) ); //verificar, si es true= es vendedor, si es false = no es el vendedor.

  res.render('propiedades/mostrar',{
    propiedad,
    pagina: propiedad.titulo,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
  })

}


const enviarMensaje = async (req, res) => {
    // Validar o comprobar que la propiedad exista
    const { id } = req.params;

    // console.log(req.usuario);
  
    // Es una forma de unir modelos para unir tablas.
    const propiedad = await Propiedad.findByPk(id,{
      include: [
        { model: Categoria, as: 'categoria'},
        { model: Precio, as: 'precio'},
      ]
    });
  
    if(!propiedad){
      return res.redirect('/404') // Envia a la pagina 404 osea error. porque no existe.
    }

    // Renderizar los errores
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
      res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
        errores: resultado.array()
        })
    }

    
    // console.log(req.body);
    // console.log(req.params);
    // console.log(req.usuario);

    const { mensaje } = req.body
    const { id: propiedadId } = req.params
    const { id: usuarioId } = req.usuario


    // Almacenar el mensaje
    await Mensaje.create({
      mensaje,
      propiedadId,
      usuarioId
    })


    res.redirect('/')

    // res.render('propiedades/mostrar',{
    //   propiedad,
    //   pagina: propiedad.titulo,
    //   csrfToken: req.csrfToken(),
    //   usuario: req.usuario,
    //   esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
    //   enviado: true
    //   })

      
    // console.log( esVendedor(req.usuario?.id, propiedad.usuarioId) ); //verificar, si es true= es vendedor, si es false = no es el vendedor.
}



// Leer mensajes recibidos
const verMensajes = async (req, res) => {

    // console.log('Eliminando');
     const { id } = req.params //extraer el id de la url.

    // Validar que la propiedad exista.
    const propiedad = await Propiedad.findByPk(id, {
      include: [
        { model: Mensaje, as: 'mensajes',
            include: [
              { model: Usuario.scope('eliminarPassword'), as: 'usuario'}
          ]
      }
        
      ]
    }); // busca si existe el primary key
  
  
    // Si no existe... hacemos esto.
    if(!propiedad){
      return res.redirect('/mis-propiedades')
    }
  
    // Revisar que quien visita la url es quien ha creado la propiedad - en caso que sean diferentes los ids
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
      return res.redirect('/mis-propiedades')
    }

  res.render('propiedades/mensajes', {
    pagina: 'Mensajes',
    mensajes: propiedad.mensajes,
    formatearFecha
  })
}



export { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad, enviarMensaje, verMensajes, cambiarEstado };
