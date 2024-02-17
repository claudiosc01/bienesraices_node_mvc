/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\n(function() {\r\n\r\n    const lat = -11.0553439; \r\n    const lng = -75.3274477;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);\r\n\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa); // esta encima de nuestro mapa.\r\n\r\n\r\n    let propiedades = [];\r\n\r\n\r\n    //Variables.\r\n    const categoriaSelect = document.querySelector('#categorias')\r\n    const preciosSelect = document.querySelector('#precios') \r\n\r\n\r\n    // Filtros\r\n    const filtros = {\r\n        categoria: '',\r\n        precio: ''\r\n    }\r\n\r\n\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n\r\n    // Filtrado de Categorias y Precios\r\n    categoriaSelect.addEventListener('change', e => {\r\n        //console.log(e.target.value); //acceder al valor que tenemos seleccionado.\r\n        filtros.categoria = +e.target.value;\r\n        filtrarPropiedades();\r\n    })\r\n\r\n    preciosSelect.addEventListener('change', e => {\r\n        //console.log(e.target.value); //acceder al valor que tenemos seleccionado.\r\n        filtros.precio = +e.target.value;\r\n        filtrarPropiedades();\r\n    })\r\n\r\n\r\n\r\n    const obtenerPropiedades = async () => {\r\n        try {\r\n            const url = '/api/propiedades'\r\n\r\n            const respuesta = await fetch(url)\r\n            //console.log(respuesta); //ver si hubo conexion correcta. fetch es para ver si laconexin es correcta.\r\n\r\n            //obtener informacion\r\n            propiedades = await respuesta.json()\r\n            //console.log(propiedades); //obtendremos todos los registros.\r\n\r\n            mostrarPropiedades(propiedades)\r\n\r\n\r\n        } catch (error) {\r\n            console.log(error);            \r\n        }\r\n    }\r\n\r\n    const mostrarPropiedades = propiedades => {\r\n\r\n        // Limpiar los markers previos\r\n        markers.clearLayers(); \r\n\r\n\r\n        // console.log(propiedades);\r\n        propiedades.forEach(propiedad => {\r\n            \r\n            // Agregar los pines\r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], { // se pone ? por si acaso la ese parametro no llega a existir.\r\n                autoPan: true, // al dar click en el marker centrar la vista.\r\n            })\r\n            .addTo(mapa)\r\n            .bindPopup(`\r\n\r\n                <p class=\"text-indigo-600 font-bold\">${propiedad?.categoria.nombre}</p>\r\n                <h1 class=\"text-xs font-extrabold uppercase my-3\">${propiedad.titulo}</h1>\r\n                <img src=\"/uploads/${propiedad.imagen}\" alt=\"Imagen de la propiedad ${propiedad.titulo}\">\r\n                <p class=\"text-gray-600 font-bold\">${propiedad.precio.nombre}</p>\r\n                <a href=\"/propiedad/${propiedad.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\">Ver Propiedad</a>\r\n\r\n            `)\r\n\r\n            markers.addLayer(marker) //permite limpiar los resultados que no coinciden con los criterios de la persona.\r\n\r\n\r\n        })\r\n    }\r\n\r\n\r\n    const filtrarPropiedades = () => {\r\n        //console.log(propiedades);\r\n        const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio )\r\n        mostrarPropiedades(resultado);\r\n    }\r\n\r\n\r\n    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad\r\n    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad\r\n\r\n\r\n    obtenerPropiedades();\r\n\r\n})()\n\n//# sourceURL=webpack://fullstack-mvc-project/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;