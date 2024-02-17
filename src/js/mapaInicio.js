
(function() {

    const lat = -11.0553439; 
    const lng = -75.3274477;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);


    let markers = new L.FeatureGroup().addTo(mapa); // esta encima de nuestro mapa.


    let propiedades = [];


    //Variables.
    const categoriaSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios') 


    // Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }



    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


    // Filtrado de Categorias y Precios
    categoriaSelect.addEventListener('change', e => {
        //console.log(e.target.value); //acceder al valor que tenemos seleccionado.
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e => {
        //console.log(e.target.value); //acceder al valor que tenemos seleccionado.
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    })



    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'

            const respuesta = await fetch(url)
            //console.log(respuesta); //ver si hubo conexion correcta. fetch es para ver si laconexin es correcta.

            //obtener informacion
            propiedades = await respuesta.json()
            //console.log(propiedades); //obtendremos todos los registros.

            mostrarPropiedades(propiedades)


        } catch (error) {
            console.log(error);            
        }
    }

    const mostrarPropiedades = propiedades => {

        // Limpiar los markers previos
        markers.clearLayers(); 


        // console.log(propiedades);
        propiedades.forEach(propiedad => {
            
            // Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], { // se pone ? por si acaso la ese parametro no llega a existir.
                autoPan: true, // al dar click en el marker centrar la vista.
            })
            .addTo(mapa)
            .bindPopup(`

                <p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}</p>
                <h1 class="text-xs font-extrabold uppercase my-3">${propiedad.titulo}</h1>
                <img src="/uploads/${propiedad.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>

            `)

            markers.addLayer(marker) //permite limpiar los resultados que no coinciden con los criterios de la persona.


        })
    }


    const filtrarPropiedades = () => {
        //console.log(propiedades);
        const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio )
        mostrarPropiedades(resultado);
    }


    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad


    obtenerPropiedades();

})()