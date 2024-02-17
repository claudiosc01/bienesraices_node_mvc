(function() {

    
    const lat = document.querySelector('#lat').value || -11.0553439; // || para ver si el string contiene algo si esta vacio pone el segundo. en este caso  -11.0553439
    const lng = document.querySelector('#lng').value || -75.3274477;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    // Utilizar provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Colocar el pin
    marker = L.marker([lat, lng],{  // va a posicionar la latitud y longitud
        draggable: true,
        autoPan: true
    })
    .addTo(mapa);

    // Detectar el movimiento del pig, y leer lat,log
    marker.on('moveend', function(e){
        marker = e.target

        const posicion = marker.getLatLng();
        // console.log(posicion);

        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng)) // centrar el mapa a la posicion

        // Obtener la informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function(err, resultado){
            // console.log(resultado);

            marker.bindPopup(resultado.address.LongLabel)

            // Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';

        })
    })

})()