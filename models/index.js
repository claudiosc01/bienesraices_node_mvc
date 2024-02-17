//Este archivo importa todos los modelos.

import Categoria from "./Categoria.js";
import Mensaje from "./Mensaje.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from './Usuario.js'

// Precio.hasOne(Propiedad) //Propiedad tiene un precio y es una relacion de 1:1 - Esto relacionara la Tabla Propiedad con la tabla precio su idPrecio
Propiedad.belongsTo(Precio, { foreignKey: 'precioId' }) //Es lo mismo pero cambia el orden mas entendible. y con foreignKey podemos poner un nombre como queremos que se llame en este caso precioId.
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId' }) 
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId' })

Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId' })


Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId'} )
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId'} )

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}


