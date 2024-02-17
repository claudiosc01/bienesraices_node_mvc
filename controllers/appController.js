import { Sequelize } from 'sequelize'
import { Precio, Categoria, Propiedad } from "../models/index.js";

const inicio = async (req, res) => {
  const [categorias, precios, casas, departamentos] = await Promise.all([
    Categoria.findAll({ raw: true }), // con raw true solo trae los parametros existentes de categoria.
    Precio.findAll({ raw: true }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 1,
      },
      include: [
        {
          model: Precio,
          as: "precio",
        },
      ],
      order: [
        ["createdAt", "DESC"], //Para ordenar
      ],
    }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 2,
      },
      include: [
        {
          model: Precio,
          as: "precio",
        },
      ],
      order: [
        ["createdAt", "DESC"], //Para ordenar
      ],
    }),
  ]);

  // console.log(categorias);

  res.render("inicio", {
    pagina: "Inicio",
    categorias,
    precios,
    casas,
    departamentos,
    csrfToken: req.csrfToken()
  });
};




const categoria = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  //Comprobar que la categoria exista
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    // si no existe la categoria.
    return res.render("/404");
  }

  //Obtener las propiedades de la categoria
  const propiedades = await Propiedad.findAll({
    where: {
      categoriaId: id,
    },
    include: [{ model: Precio, as: "precio" }],
  });

  res.render("categoria", {
    pagina: `${categoria.nombre}s en Venta`,
    propiedades,
    csrfToken: req.csrfToken()
  });
};




const noEncontrado = (req, res) => {
    res.status(404).render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
      });
};



const buscador = async (req, res) => {

    const { termino } = req.body

    //Validar que termino no este vacio.
    if(!termino.trim()) { //el trim es para asegurarnos que no dejen espacios.
        return res.redirect('back') //nos regrega a la pagina donde estabamos.
    }

    // Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'  //busca el termino en cualquier lugar del titulo. si eliminamos el primer %, solo busca al inicio de la cadena.
            }
        },
        include: [
            { model: Precio, as: "precio" },
        ]
    })

    // ver si funciona
    //console.log(propiedades);

    res.render('busqueda', {
        pagina: `Resultados de la Busqueda`,
        propiedades,
        csrfToken: req.csrfToken()
    })

};

export { inicio, categoria, noEncontrado, buscador };
