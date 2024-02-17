import categorias from "./categorias.js";
// import Categoria from "../models/Categoria.js";

// import Precio from "../models/Precio.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";

//Otra forma de importar usando un modelo principal
import { Categoria, Precio, Usuario } from '../models/index.js';

import db from "../config/db.js";


const importarDatos = async () => {
    try {
        // Autenticar a la bd
        console.log('Datos importado correctamente');
        await db.authenticate();

        // Generar las Columnas
        console.log("Sincronizando...");
        await db.sync()

        // Insertamos los datos
        console.log("Insertando datos...");
        
        await Promise.all([ //espera todas estas promesas.
            Categoria.bulkCreate(categorias), //Inserta todos los datos de categorias a la Tabla Categoria
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios), 
        ])

        console.log('Datos importado correctamente');
        process.exit();


    }catch (e) {
        console.log(e);
        process.exit(1); //es una forma de terminar los procesos
    }
}


const eliminarDatos = async () => {
    try {

        // forma de limpiar bd.
        // await Promise.all([ 
        // Categoria.destroy({where: {}, truncate: true}), // Elimina todo los registros y con truncate vuelve a iniciar desde el id 1.
        // Precio.destroy({where: {}, truncate: true}),
        // ])

        await db.sync({force: true}); // otra forma de limpiar la base de datos.

        console.log('Datos eliminados correctamente.');
        process.exit(0);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}



if(process.argv[2] === "-i"){ //[2] el segundo argumetno
    importarDatos();
} 

if(process.argv[2] === "-e"){ //[2] el segundo argumetno
    eliminarDatos();
} 

//     "db:importar": "node ./seed/seeder.js"
