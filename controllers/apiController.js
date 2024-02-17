import { Propiedad, Precio, Categoria } from '../models/index.js'

const propiedades = async (req, res) => {

    const propiedades = await Propiedad.findAll({ //Trae todo los registros de Propiedad
        include: [
          { model: Precio, as: 'precio'},
          { model: Categoria, as: 'categoria'} //Agregar mas modelos a la propiedad es como incluir
        ]
    })

    res.json(propiedades) //ver todo las propiedades en json.
}


export {
    propiedades
 }