//Verificar si el vendedor es el propietario de la propiedad para que no sepueda enviar mensaje a si mismo de la propiedad.

const esVendedor = (usuarioId, propiedadUsuarioId) => {
    return usuarioId === propiedadUsuarioId  
}



const formatearFecha = fecha => {
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // Convertir la fecha a un objeto Date si aún no lo es
    const fechaObjeto = fecha instanceof Date ? fecha : new Date(fecha);

    return fechaObjeto.toLocaleDateString('es-ES', opciones);
};




export {
    esVendedor,
    formatearFecha
}