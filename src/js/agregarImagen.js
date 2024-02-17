import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')



Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imagenes aqui', //Texto a ver
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,        //5mb
    maxFiles: 1, // cantidad de la imagen a subir
    paralleUploads: 1, // es la cantidad de archivo que estamos soportando.
    autoProcessQueue: false, //para que si se suba en automatico o no, false es para que no se suba para esperar hasta presiona un boton de enviar, el true si se envia automatico.
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictCancelUpload: 'Cancelar',
    dictMaxFilesExceeded: 'El limite es 1 archivo.',
    dictFileTooBig: 'La imagen es demasiado grande.',
    headers: { //va a leer el CSRF generado.
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector("#publicar")

        btnPublicar.addEventListener('click', function() {
            dropzone.processQueue() //para guardar el archivo subido.
        })

        // dropzone.on('added')
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){ //ver cuantos archivos quedan en la cola con el length, pero en este caso decimos si la cola de archivos es 0 hacemos esto
                window.location.href = '/mis-propiedades'
            }
        })
    }
}

