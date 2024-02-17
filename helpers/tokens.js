import jwt from 'jsonwebtoken'


//Generar JSON WEB TOKEN...  //va a generar un token con la informacion que le pasamos
const generarJWT = id => jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d'})
//const generarJWT = datos => jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, {expiresIn: '1d'}) //otra forma para agregar mas datos al json web token.

//Generar un ID...
const generarId = () =>  Math.random().toString(32).substring(2) + Date.now().toString(32);


export {
    generarJWT,
    generarId
}